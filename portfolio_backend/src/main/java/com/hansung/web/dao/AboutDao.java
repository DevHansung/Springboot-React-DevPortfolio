package com.hansung.web.dao;


import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.About;

@Repository
public interface AboutDao extends JpaRepository<About, Integer> {
    
    @Query(value="Select * from about a where a.about_id = ?1", nativeQuery = true)
    Collection<About> getAbout(Integer id);
    
    @Query(value="select * from about a where a.username = ?1 order by a.about_id desc limit 1", nativeQuery = true)
	About findMaxIdByUsername(String username);
    
    @Query(value="select * from about a order by a.about_id desc limit 1", nativeQuery = true)
	Boolean findAboutByAll();

    @Query(value="Select * from about a where a.about_id = ?1 and username = ?2", nativeQuery = true)
	About findByIdAndUsername(int aboutId, String username);

} 