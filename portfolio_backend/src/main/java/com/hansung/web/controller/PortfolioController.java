package com.hansung.web.controller;

import java.util.List;
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

import com.hansung.web.dao.InformationDao;
import com.hansung.web.dao.PortfolioDao;
import com.hansung.web.dao.PortfolioImageDao;
import com.hansung.web.dto.ApiResponse;
import com.hansung.web.exception.AppException;
import com.hansung.web.exception.FileStorageException;
import com.hansung.web.service.PortfolioImageService;
import com.hansung.web.vo.Information;
import com.hansung.web.vo.Portfolio;
import com.hansung.web.vo.PortfolioImage;

@RestController
@RequestMapping("/api")
public class PortfolioController {

	@Autowired
	private PortfolioImageService portfolioImageService;

	@Autowired
	private PortfolioDao portfolioDao;

	@Autowired
	private PortfolioImageDao portfolioImageDao;

	@Autowired
	private InformationDao informationDao;
	
	@RequestMapping(value = "/portfolio/{username}", method = RequestMethod.GET)
	public ResponseEntity<?> getPortfolioByUser(@PathVariable("username") String username) {
		List<Portfolio> result = portfolioDao.findByUsername(username);
		if (result == null) {
			return ResponseEntity.ok().body(new ApiResponse(false, "error"));
		}
		return ResponseEntity.ok().body(result);
	}

	@RequestMapping(value = "/portfolioid/{portfolioId}", method = RequestMethod.GET)
	public ResponseEntity<?> getPortfolioById(@PathVariable("portfolioId") int portfolioId) {
		Portfolio result = portfolioDao.findById(portfolioId)
				.orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		return ResponseEntity.ok().body(result);
	}

	@RequestMapping(value = "/portfolio", method = RequestMethod.POST, consumes = {
			MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<?> insertPortfolioByUser(@RequestParam("summary") String summary,
			@RequestParam("username") String username, @RequestParam("title") String title,
			@RequestParam("period") String period, @RequestParam("technology") String technology,
			@RequestParam("github") String github, @RequestParam("image") MultipartFile image) {
		try {
			Information information = informationDao.findMaxIdByUsername(username);
			Portfolio portfolio = new Portfolio(title, summary, period, technology, username);
			PortfolioImage portfolioImage = portfolioImageService.savePortfolioImage(image);
			portfolio.setInformation(information);
			portfolio.setPortfolioImage(portfolioImage);
			portfolioImage.setPortfolio(portfolio);
			portfolioImage.setUsername(username);
			portfolio.setGithub(github);
			information.getPortfolios().add(portfolio);
			informationDao.save(information);
			Portfolio result = portfolioDao.findByUsernameAndMax(username);
			return ResponseEntity.ok().body(result);
		} catch (FileStorageException e) {
			throw new FileStorageException(e.getMessage());
		}
	}

	@RequestMapping(value = "/portfolioimage/{portfolioId}", method = RequestMethod.PUT, consumes = {
			MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<?> updatePortfolioImageById(@PathVariable("portfolioId") int portfolioId,
			@RequestParam("summary") String summary, @RequestParam("title") String title,
			@RequestParam("period") String period, @RequestParam("technology") String technology,
			@RequestParam("github") String github, @RequestParam("image") MultipartFile image) {
		Portfolio portfolio = portfolioDao.findById(portfolioId)
				.orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		try {
			portfolio.setTitle(title);
			portfolio.setSummary(summary);
			portfolio.setPeriod(period);
			portfolio.setTechnology(technology);
			portfolio.setGithub(github);
			if (!image.equals(null)) {
				PortfolioImage portfolioOriginImage = portfolioImageDao.getPortfolioImage(portfolioId).get();
				String originImageName = portfolioOriginImage.getFileName();
				PortfolioImage portfolioImage = portfolioImageService.updatePortfolioImage(image, originImageName);
				portfolio.setPortfolioImage(portfolioImage);
				portfolioImage.setPortfolio(portfolio);
			}
			Portfolio result = portfolioDao.save(portfolio);
			return ResponseEntity.ok().body(result);
		} catch (FileStorageException e) {
			throw new FileStorageException(e.getMessage());
		}
	}

	@RequestMapping(value = "/portfolio/{portfolioId}", method = RequestMethod.PUT)
	public ResponseEntity<?> updatePortfolioById(@PathVariable("portfolioId") int portfolioId,
			@RequestBody Map<String, Object> param) {
		Portfolio portfolio = portfolioDao.findById(portfolioId)
				.orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		String title = (String) param.get("title");
		String summary = (String) param.get("summary");
		String period = (String) param.get("period");
		String technology = (String) param.get("technology");
		String github = (String) param.get("github");
		portfolio.setTitle(title);
		portfolio.setSummary(summary);
		portfolio.setPeriod(period);
		portfolio.setTechnology(technology);
		portfolio.setGithub(github);
		Portfolio result = portfolioDao.save(portfolio);
		return ResponseEntity.ok().body(result);
	}

	@RequestMapping(value = "/portfolio/{portfolioId}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deletePortfolioById(@PathVariable int portfolioId) {
		portfolioDao.findById(portfolioId)
				.orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		PortfolioImage portfolioImage = portfolioImageDao.getPortfolioImage(portfolioId).get();
		String fileName = portfolioImage.getFileName();
		portfolioImageService.deletePortfolioImage(fileName);
		portfolioDao.deleteById(portfolioId);
		return ResponseEntity.ok().body(portfolioDao.findById(portfolioId));
	}
}
