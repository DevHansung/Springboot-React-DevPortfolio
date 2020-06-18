package com.hansung.web.dao;


import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.PortfolioImage;

@Repository
public interface PortfolioImageDao extends JpaRepository<PortfolioImage, Integer>{
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query(value="delete from portfolio_image where portfolio_id = ?1",nativeQuery = true)
    void deletePortfolioImage(Integer id);

    @Query(value="select * from portfolio_image where portfolio_id=?1", nativeQuery = true)
    Optional<PortfolioImage> getPortfolioImage(Integer id);
    
    @Query(value="select * from portfolio_image where username=?1", nativeQuery = true)
    List<PortfolioImage> getPortfolioImageByUsername(String username);
}