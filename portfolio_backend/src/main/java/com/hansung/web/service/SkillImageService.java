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

import com.hansung.web.config.SkillImageConfig;
import com.hansung.web.exception.FileStorageException;
import com.hansung.web.vo.SkillImage;

@Service
public class SkillImageService {
	private final Path skillImageLocation;

	@Autowired
	public SkillImageService(SkillImageConfig skillImageConfig) {
		this.skillImageLocation = Paths.get(skillImageConfig.getUploadDir()).toAbsolutePath().normalize();
		try {
			Files.createDirectories(this.skillImageLocation);
		} catch (Exception ex) {
			throw new FileStorageException("파일을 업로드할 디렉토리를 생성하지 못했습니다.", ex);
		}
	}

	public SkillImage saveSkillImage(MultipartFile image) {
		String originalFileName = StringUtils.cleanPath(image.getOriginalFilename());
		String fileName = System.currentTimeMillis() + "-" + originalFileName;
		String fileUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/skillimages/").path(fileName)
				.toUriString();
		String fileType = fileName.substring(fileName.lastIndexOf("."));
		try {
			if (fileName.contains("..")) {
				throw new FileStorageException("파일명에 부적합 문자가 포함되어 있습니다. " + originalFileName);
			}
			if (fileType.equals(".png") || fileType.equals(".jpg") || fileType.equals(".PNG")
					|| fileType.equals(".JPG")) {
				Path targetLocation = this.skillImageLocation.resolve(fileName);
				Files.copy(image.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
				SkillImage skillImage = new SkillImage(fileName, image.getContentType(), fileUri, image.getSize());
				return skillImage;
			} else
				throw new FileStorageException("JPG, PNG 파일만 업로드 가능합니다. Filename: " + originalFileName);
		} catch (IOException ex) {
			throw new FileStorageException(originalFileName + " 파일을 저장하는데 문제가 발생 하였습니다.");
		}
	}

	public SkillImage updateSkillImage(MultipartFile image, String originImageName) {
		String updateFileName = StringUtils.cleanPath(image.getOriginalFilename());
		String fileName = System.currentTimeMillis() + "-" + updateFileName;
		String fileUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/skillimages/").path(fileName)
				.toUriString();
		String fileType = fileName.substring(fileName.lastIndexOf("."));
		try {
			if (fileName.contains("..")) {
				throw new FileStorageException("파일명에 부적합 문자가 포함되어 있습니다. " + fileName);
			}
			Path originLocation = this.skillImageLocation.resolve(originImageName);
			if (Files.exists(originLocation)) {
				try {
					Files.delete(originLocation);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if (fileType.equals(".png") || fileType.equals(".jpg") || fileType.equals(".PNG")
					|| fileType.equals(".JPG")) {
				Path targetLocation = this.skillImageLocation.resolve(fileName);
				Files.copy(image.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
				SkillImage skillImage = new SkillImage(fileName, image.getContentType(), fileUri, image.getSize());
				return skillImage;
			} else
				throw new FileStorageException("JPG, PNG 파일만 업로드 가능합니다. Filename: " + updateFileName);
		} catch (IOException ex) {
			throw new FileStorageException(fileName + " 파일을 저장하는데 문제가 발생 하였습니다.");
		}
	}

	public void deleteSkillImage(String fileName) {
		Path savePath = this.skillImageLocation.resolve(fileName);
		if (Files.exists(savePath)) {
			try {
				Files.delete(savePath);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}