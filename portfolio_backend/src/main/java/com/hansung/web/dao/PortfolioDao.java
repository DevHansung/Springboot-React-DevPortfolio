package com.hansung.web.dao;


import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.Portfolio;

@Repository
public interface PortfolioDao extends JpaRepository<Portfolio, Integer> {
    
    @Query(value="Select * from portfolio p where p.portfolio_id = ?1", nativeQuery = true)
    Collection<Portfolio> getPortfolio(Integer id);

    @Query(value="Select * from portfolio p where p.username = ?1", nativeQuery = true)
	List<Portfolio> findByUsername(String username);

    @Query(value="Select * from portfolio p where p.portfolio_id = ?1 and p.username = ?2", nativeQuery = true)
	Portfolio findByIdAndUsername(int portfolioId, String username);

    @Query(value="select * from portfolio p where p.username = ?1 order by p.portfolio_id desc limit 1", nativeQuery = true)
	Portfolio findByUsernameAndMax(String username);
}