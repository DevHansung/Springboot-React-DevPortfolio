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

import com.hansung.web.config.AboutImageConfig;
import com.hansung.web.exception.FileStorageException;
import com.hansung.web.vo.AboutImage;

@Service
public class AboutImageService {
	private final Path aboutImageLocation;

	@Autowired
	public AboutImageService(AboutImageConfig aboutImageConfig) {
		this.aboutImageLocation = Paths.get(aboutImageConfig.getUploadDir()).toAbsolutePath().normalize();
		try {
			Files.createDirectories(this.aboutImageLocation);
		} catch (Exception ex) {
			throw new FileStorageException("파일을 업로드할 디렉토리를 생성하지 못했습니다.", ex);
		}
	}

	public AboutImage saveAboutImage(MultipartFile image) {
		String originalFileName = StringUtils.cleanPath(image.getOriginalFilename());
		String fileName = System.currentTimeMillis() + "-" + originalFileName;
		String fileUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/aboutimages/").path(fileName)
				.toUriString();
		String fileType = fileName.substring(fileName.lastIndexOf("."));
		try {
			if (fileName.contains("..")) {
				throw new FileStorageException("파일명에 부적합 문자가 포함되어 있습니다. " + originalFileName);
			}
			if (fileType.equals(".png") || fileType.equals(".jpg") || fileType.equals(".PNG")
					|| fileType.equals(".JPG")) {
				Path targetLocation = this.aboutImageLocation.resolve(fileName);
				Files.copy(image.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
				AboutImage aboutImage = new AboutImage(fileName, image.getContentType(), fileUri, image.getSize());
				return aboutImage;
			} else
				throw new FileStorageException("JPG, PNG 파일만 업로드 가능합니다. Filename: " + originalFileName);
		} catch (IOException ex) {
			throw new FileStorageException(originalFileName + " 파일을 저장하는데 문제가 발생 하였습니다.");
		}
	}

	public AboutImage updateAboutImage(MultipartFile image, String originImageName) {
		String updateFileName = StringUtils.cleanPath(image.getOriginalFilename());
		String fileName = System.currentTimeMillis() + "-" + updateFileName;
		String fileUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/aboutimages/").path(fileName)
				.toUriString();
		String fileType = fileName.substring(fileName.lastIndexOf("."));
		try {
			if (fileName.contains("..")) {
				throw new FileStorageException("파일명에 부적합 문자가 포함되어 있습니다. " + fileName);
			}
			Path originLocation = this.aboutImageLocation.resolve(originImageName);
			if (Files.exists(originLocation)) {
				try {
					Files.delete(originLocation);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if (fileType.equals(".png") || fileType.equals(".jpg") || fileType.equals(".PNG")
					|| fileType.equals(".JPG")) {
				Path targetLocation = this.aboutImageLocation.resolve(fileName);
				Files.copy(image.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
				AboutImage aboutImage = new AboutImage(fileName, image.getContentType(), fileUri, image.getSize());
				return aboutImage;
			} else
				throw new FileStorageException("JPG, PNG 파일만 업로드 가능합니다. Filename: " + fileName);
		} catch (IOException ex) {
			throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
		}
	}

	public void deleteAboutImage(String fileName) {
		Path savePath = this.aboutImageLocation.resolve(fileName);
		if (Files.exists(savePath)) {
			try {
				Files.delete(savePath);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}