package com.hansung.web.controller;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hansung.web.dao.RoleDao;
import com.hansung.web.dao.UserDao;
import com.hansung.web.dto.ApiResponse;
import com.hansung.web.dto.UserIdentityAvailability;
import com.hansung.web.dto.UserProfile;
import com.hansung.web.exception.ResourceNotFoundException;
import com.hansung.web.security.CurrentUser;
import com.hansung.web.security.UserPrincipal;
import com.hansung.web.vo.Role;
import com.hansung.web.vo.RoleName;
import com.hansung.web.vo.User;

@RestController
@RequestMapping("/api")
public class UserController {

	@Autowired
	private UserDao userDao;

	@Autowired
	RoleDao roleDao;

	// 토큰이 변조되었거나 유효하지 않다면 error를 리턴, 클라이언트 측에서는 로그아웃 처리됨
	@GetMapping("/user/me")
	public ResponseEntity<?> getCurrentUser(@CurrentUser UserPrincipal currentUser) {
		try {
			UserPrincipal userPrincipal = new UserPrincipal(currentUser.getId(), currentUser.getName(),
					currentUser.getUsername(), currentUser.getAuthorities());
			return ResponseEntity.ok().body(userPrincipal);

		} catch (NullPointerException e) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
		}
	}

	@GetMapping("/user/checkUsernameAvailability")
	public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
		Boolean isAvailable = !userDao.existsByUsername(username);
		return new UserIdentityAvailability(isAvailable);
	}

	@GetMapping("/user/checkEmailAvailability")
	public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
		Boolean isAvailable = !userDao.existsByEmail(email);
		return new UserIdentityAvailability(isAvailable);
	}

	@GetMapping("/users/{username}")
	public UserProfile getUserProfile(@PathVariable(value = "username") String username) {
		User user = userDao.findByUsername(username)
				.orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
		UserProfile userProfile = new UserProfile(user.getId(), user.getUsername(), user.getName());
		return userProfile;
	}
	
	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@GetMapping("/user/alluser")
	public ResponseEntity<?> getAllUser() {
		try {
			List<User> allUser = userDao.findAll();
			return ResponseEntity.ok().body(allUser);

		} catch (NullPointerException e) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
		}
	}

	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/user/enabled/{userid}", method = RequestMethod.PUT)
	public ResponseEntity<?> updateEnabled(@PathVariable("userid") Long userid) {
		User User = userDao.findById(userid).get();
		if (User.getEnabled() == 0) {
			User.setEnabled(1);
			return ResponseEntity.ok().body(userDao.save(User));
		} else if (User.getEnabled() == 1) {
			User.setEnabled(0);
			return ResponseEntity.ok().body(userDao.save(User));
		}
		return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
	}

	@PreAuthorize("hasRole('ADMIN') or hasRole('TOPADMIN')")
	@RequestMapping(value = "/user/role/{userid}", method = RequestMethod.PUT)
	public ResponseEntity<?> updateRoleEdit(@PathVariable("userid") Long userid,
			@RequestBody Map<String, Object> param) {
		String username = (String) param.get("username");
		User user = userDao.findByUsername(username).get();
		if (userDao.findRoleNameByUserid(user.getId()) == 3) {
			User targetUser = userDao.findById(userid).get();
			if (userDao.findRoleNameByUserid(userid) == 1) {
				Set<Role> userRole = roleDao.findByName(RoleName.ROLE_ADMIN);
				targetUser.setRoles(userRole);
				User result = userDao.save(targetUser);
				return ResponseEntity.ok().body(result);
			}
			Set<Role> userRole = roleDao.findByName(RoleName.ROLE_USER);
			targetUser.setRoles(userRole);
			User result = userDao.save(targetUser);
			return ResponseEntity.ok().body(result);
		}
		return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
	}
}