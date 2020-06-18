package com.hansung.web.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.PortfolioLike;

@Repository
public interface PortfolioLikeDao extends JpaRepository<PortfolioLike, Integer>{
    @Query(value= "Select portfolio_like_id from portfolio_like pl where pl.info_id = ?1 and pl.username = ?2", nativeQuery = true)
    String getLikeByInfoId(int infoId, String username);
    
    @Query(value= "Select username from portfolio_like pl where pl.info_id = ?1 and pl.username = ?2", nativeQuery = true)
    String getLikeByUsername(int infoId, String user);

    @Query(value="Select count(username) from portfolio_like where info_id = ?1", nativeQuery = true)
    int getCountLike(int infoId);
    
    @Query(value="Select portfolio_like_id from portfolio_like where portfolio_like_id = ?1", nativeQuery = true)
    String getLikeByLikeId(int portfolioLikeId);

	List<PortfolioLike> findByUsername(String username);
}