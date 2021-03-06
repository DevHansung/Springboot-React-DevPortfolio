package com.hansung.web.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.hansung.web.config.PortfolioPdfConfig;
import com.hansung.web.exception.FileStorageException;
import com.hansung.web.vo.PortfolioPdf;

@Service
public class PortfolioPdfService {
	private final Path portfolioPdfLocation;

	@Autowired
	public PortfolioPdfService(PortfolioPdfConfig portfolioPdfConfig) {
		this.portfolioPdfLocation = Paths.get(portfolioPdfConfig.getUploadDir()).toAbsolutePath().normalize();
		try {
			Files.createDirectories(this.portfolioPdfLocation);
		} catch (Exception ex) {
			throw new FileStorageException("파일을 업로드할 디렉토리를 생성하지 못했습니다.", ex);
		}
	}

	public PortfolioPdf savePortfolioPdf(MultipartFile pdf, String username) {
		String originalFileName = StringUtils.cleanPath(pdf.getOriginalFilename());
		String fileName = System.currentTimeMillis() + "-" + originalFileName;
		String fileUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/portfoliopdfs/").path(fileName)
				.toUriString();
		String fileType = fileName.substring(fileName.lastIndexOf("."));
		try {
			if (fileName.contains("..")) {
				throw new FileStorageException("파일명에 부적합 문자가 포함되어 있습니다. " + originalFileName);
			}
			if (fileType.equals(".pdf") || fileType.equals(".PDF")) {
				Path targetLocation = this.portfolioPdfLocation.resolve(fileName);
				Files.copy(pdf.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
				PortfolioPdf portfolioPdf = new PortfolioPdf(username, fileName, pdf.getContentType(), fileUri,
						pdf.getSize());
				return portfolioPdf;
			} else
				throw new FileStorageException("PDF 파일만 업로드 가능합니다. Filename: " + originalFileName);
		} catch (IOException ex) {
			throw new FileStorageException(originalFileName + " 파일을 저장하는데 문제가 발생 하였습니다.");
		}
	}

	public void deletePortfolioPdf(String fileName) {
		Path savePath = this.portfolioPdfLocation.resolve(fileName);
		if (Files.exists(savePath)) {
			try {
				Files.delete(savePath);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}