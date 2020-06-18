package com.hansung.web.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

	private final long MAX_AGE_SECS = 3600;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOrigins("*")
				.allowedMethods("HEAD", "OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE").maxAge(MAX_AGE_SECS);
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		String aboutImagesPath = "file:///C:/Dev/springDev/portfolio_backend/src/main/resources/static/aboutimages/";
		String portfolioImagesPath = "file:///C:/Dev/springDev/portfolio_backend/src/main/resources/static/portfolioimages/";
		String skillImagesPath = "file:///C:/Dev/springDev/portfolio_backend/src/main/resources/static/skillimages/";
		String portfolioPdfImagesPath = "file:///C:/Dev/springDev/portfolio_backend/src/main/resources/static/portfoliopdfs/";

		registry.addResourceHandler("/aboutimages/**").addResourceLocations(aboutImagesPath);
		registry.addResourceHandler("/portfolioimages/**").addResourceLocations(portfolioImagesPath);
		registry.addResourceHandler("/skillimages/**").addResourceLocations(skillImagesPath);
		registry.addResourceHandler("/portfoliopdfs/**").addResourceLocations(portfolioPdfImagesPath);

		registry.addResourceHandler("/**").addResourceLocations("classpath:/static/");
	}
}
