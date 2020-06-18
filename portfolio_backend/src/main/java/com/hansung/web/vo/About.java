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
@Table(name = "about")
public class About extends DateAudit{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="about_id")
	private int aboutId;

	private String text; 
	
	private String username; 
	
	private String favorite;
	
    @JsonManagedReference
    @OneToOne(fetch=FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "about")
    private AboutImage aboutImage;
	
    @JsonBackReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="info_id")
    private Information information;
    
    public About(){
    }
    
	public About(String username, String text, String favorite) {
		this.username=username;
		this.text=text;
		this.favorite=favorite;
	}
}