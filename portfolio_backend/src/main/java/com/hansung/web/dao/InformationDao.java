package com.hansung.web.dao;


import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.Information;

@Repository
public interface InformationDao extends JpaRepository<Information, Integer> {
    
    @Query(value="select * from information i where i.username = ?1 order by i.info_id desc limit 1", nativeQuery = true)
    Information findMaxIdByUsername(String username);

    @Query(value="Select * from information i where i.info_id = ?1 and i.username = ?2", nativeQuery = true)
    Information findByIdAndUsername(int infoId, String username);

    @Transactional
	void deleteByUsername(String username);
	
    @Query(value="select u.username, count(i.info_id) as informationId, \r\n" + 
    		"count(p.portfolio_id) as portfolioId, count(a.about_id) as aboutId, \r\n" + 
    		"count(s.skill_id) as skillId, count(pdf.portfolio_pdf_id) as portfolioPdfId from users u \r\n" + 
    		"left outer join portfolio p \r\n" + 
    		"on u.username = p.username\r\n" + 
    		"left outer join skill s \r\n" + 
    		"on u.username = s.username\r\n" + 
    		"left outer join about a \r\n" + 
    		"on u.username = a.username\r\n" + 
    		"left outer join information i\r\n" + 
    		"on u.username = i.username\r\n" + 
    		"left outer join portfolio_pdf pdf\r\n" + 
    		"on u.username = pdf.username\r\n" + 
    		"GROUP BY u.username", nativeQuery = true)
    List<Map<String, Object>> findPortfolioByAll();
} 