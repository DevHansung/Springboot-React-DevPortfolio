package com.hansung.web.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "skillimage")
public class SkillImageConfig {
    private String uploadDir;

    public String getUploadDir(){
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }
}