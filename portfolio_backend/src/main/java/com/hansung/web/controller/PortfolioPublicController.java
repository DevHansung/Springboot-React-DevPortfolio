package com.hansung.web.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.hansung.web.dao.InformationDao;
import com.hansung.web.dao.PortfolioLikeDao;
import com.hansung.web.dto.ApiResponse;
import com.hansung.web.service.PortfolioDeleteService;
import com.hansung.web.vo.Information;
import com.hansung.web.vo.PortfolioLike;

@RestController
@RequestMapping("/api")
public class PortfolioPublicController {

	@Autowired
	private InformationDao informationDao;
	 
	@Autowired
	private PortfolioDeleteService portfolioDeleteService;

	@Autowired
	private PortfolioLikeDao portfolioLikeDao;
	
	@RequestMapping(value = "/allportfolio", method = RequestMethod.GET)
	public ResponseEntity<?> getAllPortfolio() {
		List<Map<String, Object>> all = informationDao.findPortfolioByAll();
		return ResponseEntity.ok().body(all);
	}
	
	@RequestMapping(value = "/deleteall/{username}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteAllPortfolioByUser(@PathVariable String username) throws Exception {
		try {
			portfolioDeleteService.deleteAllPortfolio(username);
		} catch (Exception e) {
			throw new Exception(e);
		}
		return ResponseEntity.ok().body(new ApiResponse(true, "success"));
	}

	@RequestMapping(value = "/loadlikes/{username}", method = RequestMethod.GET)
	public ResponseEntity<?> getLikesByUser(@PathVariable String username) {
		List<PortfolioLike> result = portfolioLikeDao.findByUsername(username);
		return ResponseEntity.ok().body(result);
	}
	
	@RequestMapping(value = "/countlike/{infoId}", method = RequestMethod.GET)
	public ResponseEntity<?> getCountLike(@PathVariable int infoId) {
		return ResponseEntity.ok().body(portfolioLikeDao.getCountLike(infoId));
	}
	
	@RequestMapping(value = { "/loadlike/{infoId}/{username}" }, method = RequestMethod.GET)
	public ResponseEntity<?> getLikeByUser(@PathVariable("infoId") int infoId, @PathVariable("username") String username) {
		return ResponseEntity.ok().body(portfolioLikeDao.getLikeByInfoId(infoId, username));
	}
	
	@RequestMapping(value = "/like/{infoId}", method = RequestMethod.POST)
	public ResponseEntity<?> insertLike(@PathVariable int infoId, @RequestBody PortfolioLike portfolioLike) {
		if (portfolioLikeDao.getLikeByUsername(infoId, portfolioLike.getUsername()) != null) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
		}
		Information information = informationDao.findById(infoId).get();
		portfolioLike.setTargetUsername(information.getUsername());
		portfolioLike.setInformation(information);
		information.getPortfolioLikes().add(portfolioLike);
		informationDao.save(information);
		return ResponseEntity.ok().body(portfolioLikeDao.getLikeByInfoId(infoId, portfolioLike.getUsername()));
	}
	
	@RequestMapping(value = "/like/{portfolioLikeId}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteLike(@PathVariable int portfolioLikeId) {
		if (portfolioLikeDao.getLikeByLikeId(portfolioLikeId) == null) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
		}
		portfolioLikeDao.deleteById(portfolioLikeId);
		return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
	}
}
