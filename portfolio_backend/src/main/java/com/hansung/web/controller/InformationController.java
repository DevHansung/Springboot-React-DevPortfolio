package com.hansung.web.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.hansung.web.dao.InformationDao;
import com.hansung.web.dto.ApiResponse;
import com.hansung.web.exception.AppException;
import com.hansung.web.vo.Information;

@RestController
@RequestMapping("/api")
public class InformationController {

	@Autowired
	private InformationDao informationDao;

	@RequestMapping(value = "/information/{username}", method = RequestMethod.GET)
	public ResponseEntity<?> getInformationByUser(@PathVariable String username) {
		Information result = informationDao.findMaxIdByUsername(username);
		if (result == null) {
			return ResponseEntity.ok().body(new ApiResponse(false, "error"));
		}
		return ResponseEntity.ok().body(result);
	}

	@RequestMapping(value = "/informationid/{infoId}", method = RequestMethod.GET)
	public ResponseEntity<?> getInformationById(@PathVariable int infoId) {
		Information result = informationDao.findById(infoId)
				.orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		return ResponseEntity.ok().body(result);
	}

	@RequestMapping(value = "/information", method = RequestMethod.POST)
	public ResponseEntity<?> insertInformationByUser(@RequestBody Map<String, Object> param) {
		String username = (String) param.get("username");
		String title = (String) param.get("title");
		String text = (String) param.get("text");
		String summary = (String) param.get("summary");
		String name = (String) param.get("name");
		String email = (String) param.get("email");
		String github = (String) param.get("github");
		try {
			Information informationList = informationDao.findMaxIdByUsername(username);
			if (informationList != null) {
				informationDao.deleteById(informationList.getInfoId());
			}
			Information information = new Information();
			information.setUsername(username);
			information.setTitle(title);
			information.setText(text);
			information.setSummary(summary);
			information.setName(name);
			information.setEmail(email);
			information.setGithub(github);
			informationDao.save(information);

			Information result = informationDao.findMaxIdByUsername(username);
			return ResponseEntity.ok().body(result);
		} catch (Exception e) {
			throw new AppException(HttpStatus.NOT_FOUND, "information upload error");
		}
	}

	// 수정 구현
	@RequestMapping(value = "/information/{infoId}", method = RequestMethod.PUT)
	public ResponseEntity<?> updateInformationById(@PathVariable("infoId") int infoId,
			@RequestBody Map<String, Object> param) {
		Information information = informationDao.findById(infoId)
				.orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		information.setTitle((String) param.get("title"));
		information.setText((String) param.get("text"));
		information.setSummary((String) param.get("summary"));
		information.setName((String) param.get("name"));
		information.setEmail((String) param.get("email"));
		information.setGithub((String) param.get("github"));
		Information result = informationDao.save(information);
		return ResponseEntity.ok().body(result);
	}

	// 삭제 구현
	@RequestMapping(value = "/information/{infoId}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteInformationById(@PathVariable int infoId) {
		informationDao.findById(infoId)
				.orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		informationDao.deleteById(infoId);
		return ResponseEntity.ok().body(informationDao.findById(infoId));
	}
}
