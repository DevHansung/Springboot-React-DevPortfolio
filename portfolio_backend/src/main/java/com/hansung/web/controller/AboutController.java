package com.hansung.web.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hansung.web.dao.AboutDao;
import com.hansung.web.dao.AboutImageDao;
import com.hansung.web.dao.InformationDao;
import com.hansung.web.dto.ApiResponse;
import com.hansung.web.exception.AppException;
import com.hansung.web.exception.FileStorageException;
import com.hansung.web.service.AboutImageService;
import com.hansung.web.vo.About;
import com.hansung.web.vo.AboutImage;
import com.hansung.web.vo.Information;

@RestController
@RequestMapping("/api")
public class AboutController {

	@Autowired
	private AboutImageService aboutImageService;

	@Autowired
	private AboutDao aboutDao;

	@Autowired
	private AboutImageDao aboutImageDao;

	@Autowired
	private InformationDao informationDao;
	
	@RequestMapping(value = "/about/{username}", method = RequestMethod.GET)
	public ResponseEntity<?> getAboutByUser(@PathVariable String username) {
		About result = aboutDao.findMaxIdByUsername(username);
		if (result == null) {
			return ResponseEntity.ok().body(new ApiResponse(false, "error"));
		}
		return ResponseEntity.ok().body(result);

	}

	@RequestMapping(value = "/aboutid/{aboutId}", method = RequestMethod.GET)
	public ResponseEntity<?> getAboutById(@PathVariable("aboutId") int aboutId) {
		About result = aboutDao.findById(aboutId)
				.orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		return ResponseEntity.ok().body(result);
	}

	@RequestMapping(value = "/about", method = RequestMethod.POST, consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<?> insertAboutByUser(@RequestParam("text") String text,
			@RequestParam("favorite") String favorite, @RequestParam("username") String username,
			@RequestParam("image") MultipartFile image) {
		About aboutList = aboutDao.findMaxIdByUsername(username);
		if (aboutList != null) {
			AboutImage aboutImage = aboutImageDao.getMaxAboutImage().get();
			int aboutId = aboutImage.getAbout().getAboutId();
			String fileName = aboutImage.getFileName();
			aboutImageService.deleteAboutImage(fileName);
			aboutDao.deleteById(aboutId);
		}
		try {
			Information information = informationDao.findMaxIdByUsername(username);
			About about = new About(username, text, favorite);
			AboutImage aboutImage = aboutImageService.saveAboutImage(image);
			about.setInformation(information);
			about.setAboutImage(aboutImage);
			aboutImage.setAbout(about);
			aboutImage.setUsername(username);
			information.getAbouts().add(about);
			informationDao.save(information);
			About result = aboutDao.findMaxIdByUsername(username);
			return ResponseEntity.ok().body(result);
		} catch (FileStorageException e) {
			throw new FileStorageException(e.getMessage());
		}

	}

	@RequestMapping(value = "/aboutimage/{aboutId}", method = RequestMethod.PUT, consumes = {
			MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<?> updateAboutImageById(@PathVariable("aboutId") int aboutId,
			@RequestParam("text") String text, @RequestParam("favorite") String favorite,
			@RequestParam("image") MultipartFile image) {
		About about = aboutDao.findById(aboutId)
				.orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		try {
			about.setText(text);
			about.setFavorite(favorite);
			if (!image.equals(null)) {
				AboutImage aboutOriginImage = aboutImageDao.getAboutImage(aboutId).get();
				String originImageName = aboutOriginImage.getFileName();
				AboutImage aboutImage = aboutImageService.updateAboutImage(image, originImageName);
				about.setAboutImage(aboutImage);
				aboutImage.setAbout(about);
			}
			About result = aboutDao.save(about);
			return ResponseEntity.ok().body(result);
		} catch (FileStorageException e) {
			throw new FileStorageException(e.getMessage());
		}
	}

	@RequestMapping(value = "/about/{aboutId}", method = RequestMethod.PUT)
	public ResponseEntity<?> updateAboutById(@PathVariable("aboutId") int aboutId,
			@RequestBody Map<String, Object> param) {
		About about = aboutDao.findById(aboutId)
				.orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		try {
			String text = (String) param.get("text");
			String favorite = (String) param.get("favorite");
			about.setText(text);
			about.setFavorite(favorite);
			About result = aboutDao.save(about);
			return ResponseEntity.ok().body(result);
		} catch (Exception e) {
			throw new AppException(HttpStatus.NOT_FOUND, "about edit error");
		}
	}

	@RequestMapping(value = "/about/{aboutId}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deletePortfolioById(@PathVariable int aboutId) {
		aboutDao.findById(aboutId).orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		try {
			AboutImage aboutImage = aboutImageDao.getAboutImage(aboutId).get();
			String fileName = aboutImage.getFileName();
			aboutImageService.deleteAboutImage(fileName);
			aboutDao.deleteById(aboutId);
			return ResponseEntity.ok().body(aboutDao.findById(aboutId));
		} catch (Exception e) {
			throw new AppException(HttpStatus.NOT_FOUND, "about delete error");
		}
	}
}
