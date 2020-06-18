package com.hansung.web.dao;


import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.SkillImage;

@Repository
public interface SkillImageDao extends JpaRepository<SkillImage, Integer>{
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query(value="delete from skill_image where skill_id = ?1",nativeQuery = true)
    void deleteSkillImage(Integer id);

    @Query(value="select * from skill_image where skill_id=?1", nativeQuery = true)
    Optional<SkillImage> getSkillImage(Integer id);
    
    @Query(value="select * from skill_image where skill_id=?1 and username=?2", nativeQuery = true)
    Optional<SkillImage> getSkillImageByUsername(Integer id, String username);
    
    @Query(value="select * from skill_image where username=?1", nativeQuery = true)
	List<SkillImage> getPortfolioImageByUsername(String username);
}