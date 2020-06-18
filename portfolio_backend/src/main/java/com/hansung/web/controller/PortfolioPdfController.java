package com.hansung.web.controller;

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
import com.hansung.web.dao.PortfolioPdfDao;
import com.hansung.web.dto.ApiResponse;
import com.hansung.web.exception.AppException;
import com.hansung.web.exception.FileStorageException;
import com.hansung.web.service.PortfolioPdfService;
import com.hansung.web.vo.Information;
import com.hansung.web.vo.PortfolioPdf;

@RestController
@RequestMapping("/api")
public class PortfolioPdfController {

	@Autowired
	private PortfolioPdfService portfolioPdfService;

	@Autowired
	private PortfolioPdfDao portfolioPdfDao;

	@Autowired
	private InformationDao informationDao;

	@RequestMapping(value = "/portfoliopdf/{username}", method = RequestMethod.GET)
	public ResponseEntity<?> getAboutByUser(@PathVariable String username) {
		PortfolioPdf result = portfolioPdfDao.findMaxIdByUsername(username);
		if (result == null) {
			return ResponseEntity.ok().body(new ApiResponse(false, "error"));
		}
		return ResponseEntity.ok().body(result);
	}

	@RequestMapping(value = "/portfoliopdf", method = RequestMethod.POST, consumes = {
			MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<?> insertAboutByUser(@RequestParam("username") String username,
			@RequestParam("pdf") MultipartFile pdf) {
		try {
			PortfolioPdf PortfolioPdfByMax = portfolioPdfDao.findMaxIdByUsername(username);
			if (PortfolioPdfByMax != null) {
				int pdfId = PortfolioPdfByMax.getPdfId();
				String fileName = PortfolioPdfByMax.getFileName();
				portfolioPdfService.deletePortfolioPdf(fileName);
				portfolioPdfDao.deleteById(pdfId);
			}
			Information information = informationDao.findMaxIdByUsername(username);
			PortfolioPdf portfolioPdf = portfolioPdfService.savePortfolioPdf(pdf, username);
			portfolioPdf.setInformation(information);
			information.getPortfolioPdfs().add(portfolioPdf);
			informationDao.save(information);
			PortfolioPdf result = portfolioPdfDao.findMaxIdByUsername(username);
			return ResponseEntity.ok().body(result);
		} catch (FileStorageException e) {
			throw new FileStorageException(e.getMessage());
		}
	}

	@RequestMapping(value = "/portfoliopdf/{pdfId}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deletePortfolioPdfById(@PathVariable int pdfId) {
		portfolioPdfDao.findById(pdfId)
				.orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "No data queried by id"));
		PortfolioPdf portfolioPdf = portfolioPdfDao.getPortfolioPdf(pdfId).get();
		String fileName = portfolioPdf.getFileName();
		portfolioPdfService.deletePortfolioPdf(fileName);
		portfolioPdfDao.deleteById(pdfId);
		return ResponseEntity.ok().body(portfolioPdfDao.findById(pdfId));

	}
}
