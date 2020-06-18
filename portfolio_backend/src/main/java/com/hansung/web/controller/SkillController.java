package com.hansung.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hansung.web.dao.InformationDao;
import com.hansung.web.dao.SkillDao;
import com.hansung.web.dao.SkillImageDao;
import com.hansung.web.dto.ApiResponse;
import com.hansung.web.exception.AppException;
import com.hansung.web.exception.FileStorageException;
import com.hansung.web.service.SkillImageService;
import com.hansung.web.vo.Information;
import com.hansung.web.vo.Skill;
import com.hansung.web.vo.SkillImage;

@RestController
@RequestMapping("/api")
public class SkillController {

	@Autowired
	private SkillImageService skillImageService;

	@Autowired
	private SkillDao skillDao;

	@Autowired
	private SkillImageDao skillImageDao;

	@Autowired
	private InformationDao informationDao;

	@RequestMapping(value = "/skill/{username}", method = RequestMethod.GET)
	public ResponseEntity<?> getSkillByUser(@PathVariable("username") String username) {
		List<Skill> result = skillDao.findByUsername(username);
		if (result == null) {
			return ResponseEntity.ok().body(new ApiResponse(false, "error"));
		}
		return ResponseEntity.ok().body(result);
	}

	@RequestMapping(value = "/skill", method = RequestMethod.POST, consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<?> insertSkillByUser(@RequestParam("username") String username,
			@RequestParam("title") String title, @RequestParam("level") String level,
			@RequestParam("categoty") String categoty, @RequestParam("image") MultipartFile image) {
		try {
			Information information = informationDao.findMaxIdByUsername(username);
			Skill skill = new Skill(title, level, categoty, username);
			SkillImage skillImage = skillImageService.saveSkillImage(image);
			skill.setInformation(information);
			skill.setSkillImage(skillImage);
			skillImage.setSkill(skill);
			skillImage.setUsername(username);
			information.getSkills().add(skill);
			informationDao.save(information);
			Skill result = skillDao.findMaxIdByUsername(username);
			return ResponseEntity.ok().body(result);
		} catch (FileStorageException e) {
			throw new FileStorageException(e.getMessage());
		}
	}

	@RequestMapping(value = "/skillimage/{SkillId}", method = RequestMethod.PUT, consumes = {
			MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<?> updateSkillImageById(@PathVariable("SkillId") int SkillId,
			@RequestParam("title") String title, @RequestParam("level") String level,
			@RequestParam("categoty") String categoty, @RequestParam("image") MultipartFile image) {
		Skill skill = skillDao.findById(SkillId)
				.orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		try {
			skill.setTitle(title);
			skill.setTitle(level);
			skill.setCategoty(categoty);
			if (!image.equals(null)) {
				SkillImage skillOriginImage = skillImageDao.getSkillImage(SkillId).get();
				String originImageName = skillOriginImage.getFileName();
				SkillImage skillImage = skillImageService.updateSkillImage(image, originImageName);
				skill.setSkillImage(skillImage);
				skillImage.setSkill(skill);
			}
			Skill result = skillDao.save(skill);
			return ResponseEntity.ok().body(result);
		} catch (FileStorageException e) {
			throw new FileStorageException(e.getMessage());
		}
	}

	@RequestMapping(value = "/skill/{skillId}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteSkillById(@PathVariable int skillId) {
		skillDao.findById(skillId).orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		SkillImage skillImage = skillImageDao.getSkillImage(skillId).get();
		String fileName = skillImage.getFileName();
		skillImageService.deleteSkillImage(fileName);
		skillDao.deleteById(skillId);
		return ResponseEntity.ok().body(skillDao.findById(skillId));
	}

}
