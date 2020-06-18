package com.hansung.web.dao;


import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.PortfolioPdf;

@Repository
public interface PortfolioPdfDao extends JpaRepository<PortfolioPdf, Integer>{
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query(value="delete from portfolio_pdf where portfolio_pdf_id = ?1",nativeQuery = true)
    void deletePortfolioPdf(Integer id);

    @Query(value="select * from portfolio_pdf where portfolio_pdf_id=?1", nativeQuery = true)
    Optional<PortfolioPdf> getPortfolioPdf(Integer id);
    
    @Query(value="select * from portfolio_pdf p where p.portfolio_pdf_id = ?1  and p.username = ?2", nativeQuery = true)
	PortfolioPdf findByMaxIdAndUsername(int pdfId, String username);

    @Query(value="select * from portfolio_pdf p where p.username = ?1", nativeQuery = true)
	List<PortfolioPdf> getPortfolioPdfByUsername(String username);
	
    @Query(value="select * from portfolio_pdf p where p.username = ?1 order by p.portfolio_pdf_id desc limit 1", nativeQuery = true)
    PortfolioPdf findMaxIdByUsername(String username);
}

