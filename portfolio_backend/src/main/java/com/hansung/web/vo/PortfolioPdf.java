package com.hansung.web.vo;

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
import com.hansung.web.vo.audit.DateAudit;

import lombok.Getter;
import lombok.Setter;

@SuppressWarnings("serial")
@Getter
@Setter
@Entity
@Table(name = "portfolio_pdf")
public class PortfolioPdf extends DateAudit {
	@Id
	@Column(name = "portfolio_pdf_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int pdfId;

	private String username;
	
	@Column(name = "file_name")
	private String fileName;

	@Column(name = "file_type")
	private String fileType;

	@Column(name = "file_uri")
	private String fileUri;

	@Column(name = "file_size")
	private long fileSize;
    
    @JsonBackReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="info_id")
    private Information information;
    
	public PortfolioPdf() {

	}

	public PortfolioPdf(String username, String fileName, String fileType, String fileUri, long fileSize) {
		this.username = username;
		this.fileName = fileName;
		this.fileUri = fileUri;
		this.fileType = fileType;
		this.fileSize = fileSize;
	}
}