package com.hansung.web.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hansung.web.dao.AboutImageDao;
import com.hansung.web.dao.InformationDao;
import com.hansung.web.dao.PortfolioImageDao;
import com.hansung.web.dao.PortfolioPdfDao;
import com.hansung.web.dao.SkillImageDao;
import com.hansung.web.vo.AboutImage;
import com.hansung.web.vo.PortfolioImage;
import com.hansung.web.vo.PortfolioPdf;
import com.hansung.web.vo.SkillImage;

@Service
public class PortfolioDeleteService {
	@Autowired
	private InformationDao informationDao;

	@Autowired
	private AboutImageService aboutImageService;
	@Autowired
	private AboutImageDao aboutImageDao;

	@Autowired
	private PortfolioImageService portfolioImageService;
	@Autowired
	private PortfolioImageDao portfolioImageDao;

	@Autowired
	private SkillImageService skillImageService;
	@Autowired
	private SkillImageDao skillImageDao;

	@Autowired
	private PortfolioPdfService portfolioPdfService;
	@Autowired
	private PortfolioPdfDao portfolioPdfDao;

	@Transactional
	public void deleteAllPortfolio(String username) throws Exception {
		try {
			AboutImage aboutImage = aboutImageDao.findMaxAboutImageIdByUsername(username);
			if(aboutImage != null) {
				String aboutFileName = aboutImage.getFileName();
				aboutImageService.deleteAboutImage(aboutFileName);
			}
			
			List<PortfolioImage> portfolioImage = portfolioImageDao.getPortfolioImageByUsername(username);
			for (int i = 0; i < portfolioImage.size(); i++) {
				String portfolioFileName = portfolioImage.get(i).getFileName();
				portfolioImageService.deletePortfolioImage(portfolioFileName);
			}
			List<SkillImage> skillImage = skillImageDao.getPortfolioImageByUsername(username);
			for (int i = 0; i < skillImage.size(); i++) {
				String skillFileName = skillImage.get(i).getFileName();
				skillImageService.deleteSkillImage(skillFileName);
			}

			PortfolioPdf portfolioPdf = portfolioPdfDao.findMaxIdByUsername(username);
			if(portfolioPdf != null) {
				String portfolioPdfFileName = portfolioPdf.getFileName();
				portfolioPdfService.deletePortfolioPdf(portfolioPdfFileName);
			}
			informationDao.deleteByUsername(username);
		} catch (NoSuchElementException e) {
		}
	}
}