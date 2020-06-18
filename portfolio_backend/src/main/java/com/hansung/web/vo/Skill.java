package com.hansung.web.vo;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.hansung.web.vo.audit.DateAudit;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@SuppressWarnings("serial")
@Getter
@Setter
@ToString
@Entity
@Table(name = "skill")
public class Skill extends DateAudit{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="skill_id")
	private int skillId;

	private String title;
	
	private String level;

	private String categoty; 
		
	private String username;
	
    @JsonManagedReference
    @OneToOne(fetch=FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "skill")
    private SkillImage skillImage;
	
    @JsonBackReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="info_id")
    private Information information;
    
    public Skill(){
    }
    
	public Skill(String title, String level, String category, String username ) {
		this.title=title;
		this.level=level;
		this.categoty=category;
		this.username=username;
	}
}