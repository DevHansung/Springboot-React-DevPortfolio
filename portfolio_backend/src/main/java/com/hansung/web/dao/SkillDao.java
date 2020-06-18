package com.hansung.web.dao;


import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.Skill;

@Repository
public interface SkillDao extends JpaRepository<Skill, Integer> {

    @Query(value="select * from skill where skill_id = ?1 and username = ?2",nativeQuery = true)
    Skill findByIdAndUsername(Integer id, String username);
    
    @Query(value="Select * from skill s where s.skill_id = ?1", nativeQuery = true)
    Collection<Skill> getSkill(Integer id);

    @Query(value="Select * from skill s where s.username = ?1", nativeQuery = true)
	List<Skill> findByUsername(String username);

    @Query(value="select * from skill s where s.username = ?1 order by s.skill_id desc limit 1", nativeQuery = true)
	Skill findMaxIdByUsername(String username);
}