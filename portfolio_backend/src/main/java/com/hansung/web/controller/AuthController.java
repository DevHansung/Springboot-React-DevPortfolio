package com.hansung.web.controller;

import java.net.URI;
import java.util.Map;
import java.util.Set;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.hansung.web.dao.BlacklistTokenDao;
import com.hansung.web.dao.RoleDao;
import com.hansung.web.dao.UserDao;
import com.hansung.web.dto.ApiResponse;
import com.hansung.web.dto.JwtAuthenticationResponse;
import com.hansung.web.dto.LoginRequest;
import com.hansung.web.dto.SignUpRequest;
import com.hansung.web.exception.UserException;
import com.hansung.web.security.CustomUserDetailsService;
import com.hansung.web.security.JwtTokenProvider;
import com.hansung.web.service.PortfolioDeleteService;
import com.hansung.web.service.RefreshTokenService;
import com.hansung.web.vo.BlacklistToken;
import com.hansung.web.vo.RefreshToken;
import com.hansung.web.vo.Role;
import com.hansung.web.vo.RoleName;
import com.hansung.web.vo.User;

import io.jsonwebtoken.ExpiredJwtException;

@RestController
@RequestMapping("/api/user")
public class AuthController {
	private final Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserDao userDao;

	@Autowired
	RoleDao roleDao;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	BlacklistTokenDao blacklistTokenDao;

	@Autowired
	JwtTokenProvider tokenProvider;

	@Autowired
	RefreshTokenService refreshTokenService;

	@Autowired
	CustomUserDetailsService customUserDetailsService;

	@Autowired
	private PortfolioDeleteService portfolioDeleteService;
	
	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
		if (userDao.existsByUsername(signUpRequest.getUsername())) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "Username is already taken!"));
		}
		if (userDao.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "Email Address already in use!"));
		}
		User user = new User(signUpRequest.getName(), signUpRequest.getUsername(), signUpRequest.getEmail(),
				signUpRequest.getPassword());
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		if (signUpRequest.getUsername().equals("ADMIN")) {
			Set<Role> userRole = roleDao.findByName(RoleName.ROLE_TOPADMIN);
			user.setRoles(userRole);
		} else if (!signUpRequest.getUsername().equals("ADMIN")) {
			Set<Role> userRole = roleDao.findByName(RoleName.ROLE_USER);
			user.setRoles(userRole);
		}
		User result = userDao.save(user);
		URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/users/{username}")
				.buildAndExpand(result.getUsername()).toUri();
		return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully"));
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest, RefreshToken refreshToken)
			throws Exception {
		try {
		String usernameFromDb = null;
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);

		User user = userDao.findByUsername(loginRequest.getUsername()).get();
		if (user.getEnabled() == 1) {
			throw new UserException("LOGIN", "비활성화 된 계정");
		}
		String jwtRefreshToken = tokenProvider.generateRefreshToken(loginRequest.getUsername());
		String jwtAccessToken = tokenProvider.generateToken(loginRequest.getUsername());

		if (refreshTokenService.findByusername(loginRequest.getUsername()) != null) {
			RefreshToken result = refreshTokenService.findByusername(loginRequest.getUsername());
			usernameFromDb = result.getUsername();
			if (loginRequest.getUsername().equals(usernameFromDb)) {
				refreshTokenService.deleteRefreshToken(loginRequest.getUsername());
			}
		}
		refreshToken.setUsername(loginRequest.getUsername());
		refreshToken.setRefreshToken(jwtRefreshToken);
		refreshTokenService.addRefreshToken(refreshToken);
		return ResponseEntity.ok(new JwtAuthenticationResponse(jwtAccessToken, jwtRefreshToken));
		}catch(BadCredentialsException e) {
			throw new UserException("LOGIN", "Id and Password error");
		}
	}

	@PostMapping(path = "/logout")
	public ResponseEntity<?> logoutUser(@RequestBody Map<String, String> params) {
		String username = null;
		String refreshToken = params.get("refreshToken");
		Long userId = null;

		if (refreshToken != null) {
			try {
				userId = tokenProvider.getUserIdFromJWT(refreshToken);
				UserDetails userDetails = customUserDetailsService.loadUserById(userId);
				username = userDetails.getUsername();
				BlacklistToken blacklistToken = new BlacklistToken();
				blacklistToken.setRefreshToken(refreshToken);
				blacklistToken.setUsername(username);
				blacklistTokenDao.save(blacklistToken);
			} catch (IllegalArgumentException e) {
				return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
			} catch (ExpiredJwtException e) {
				return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
			}
			if (refreshTokenService.findByusername(username) != null) {
				refreshTokenService.deleteRefreshToken(username);
			}
		}
		return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
	}

	@DeleteMapping(path = "/deleteuser")
	public ResponseEntity<?> deleteUser(@Valid @RequestBody LoginRequest loginRequest) {
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
			SecurityContextHolder.getContext().setAuthentication(authentication);

			User user = userDao.findByUsername(loginRequest.getUsername()).get();
			portfolioDeleteService.deleteAllPortfolio(loginRequest.getUsername());
			userDao.delete(user);
			return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
		}
	}


	@PostMapping(path = "/token/refresh")
	public ResponseEntity<?> accessTokenRefresh(@RequestBody Map<String, String> m) throws Exception{
		String refreshToken = null;
		String refreshTokenFromDb = null;
		String username = null;
		Long userId = null;
		try {
			refreshToken = m.get("refreshToken");
			userId = tokenProvider.getUserIdFromJWT(refreshToken);
			UserDetails userDetails = customUserDetailsService.loadUserById(userId);
			username = userDetails.getUsername();
			if (refreshToken != null) {
				RefreshToken enabledToken = refreshTokenService.findByusername(username);
				BlacklistToken blackToken = blacklistTokenDao.findByRefreshToken(refreshToken);
				if (enabledToken != null && blackToken == null) {
					refreshTokenFromDb = enabledToken.getRefreshToken();
					if (refreshToken.equals(refreshTokenFromDb) && !tokenProvider.isTokenExpired(refreshToken)) {
						String newAccessToken = tokenProvider.generateToken(username);
						log.info("REFRESH_FOR_ACCESS-TOKEN: [username: : ({}), access_token : ({}), refresh_token : ({})]",
								username, newAccessToken, refreshToken);
						return ResponseEntity.ok(new JwtAuthenticationResponse(newAccessToken, refreshToken));
					} else {
						throw new UserException("ERROR_RESRESH_TOKEN", "refresh token validation failure");
					}
				} else {
					throw new UserException("ERROR_RESRESH_TOKEN", "refresh token validation failure");
				}
			} else {
				throw new UserException("ERROR_RESRESH_TOKEN", "refresh token not found");
			}
		} catch (IllegalArgumentException e) {
			throw new UserException("ERROR_RESRESH_TOKEN", "refresh token validation failure");
		} catch (ExpiredJwtException e) {
			throw new UserException("ERROR_RESRESH_TOKEN", "refresh token validation failure");
		}
	}
}