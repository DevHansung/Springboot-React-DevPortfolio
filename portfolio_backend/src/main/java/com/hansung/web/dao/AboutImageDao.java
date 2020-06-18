package com.hansung.web.dao;


import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.AboutImage;

@Repository
public interface AboutImageDao extends JpaRepository<AboutImage, Integer>{
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query(value="delete from about_image where about_id = ?1",nativeQuery = true)
    void deleteAboutImage(Integer id);

    @Query(value="select * from about_image where about_id=?1", nativeQuery = true)
    Optional<AboutImage> getAboutImage(Integer id);
    
    @Query(value="select * from about_image a order by a.about_id desc limit 1", nativeQuery = true)
    Optional<AboutImage> getMaxAboutImage();

    @Query(value="select * from about_image where username=?1", nativeQuery = true)
    List<AboutImage> getAboutImageByUsername(String username);

    @Query(value="select * from about_image a where a.username = ?1 order by a.about_imgid desc limit 1", nativeQuery = true)
	AboutImage findMaxAboutImageIdByUsername(String username);
}

