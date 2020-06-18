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
@Table(name = "portfolio")
public class Portfolio extends DateAudit {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "portfolio_id")
	private int portfolioId;

	private String title;

	private String summary;

	private String period;

	private String technology;

	private String username;
	
	private String github;

	@JsonManagedReference
	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "portfolio")
	private PortfolioImage portfolioImage;
	
    @JsonBackReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="info_id")
    private Information information;

	public Portfolio() {
	}

	public Portfolio(String title, String summary, String period, String technology, String username) {
		this.title = title;
		this.summary = summary;
		this.period = period;
		this.technology = technology;
		this.username = username;
	}
}