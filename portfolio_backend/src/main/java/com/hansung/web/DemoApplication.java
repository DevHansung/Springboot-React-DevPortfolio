package com.hansung.web;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

import com.hansung.web.config.AboutImageConfig;
import com.hansung.web.config.PortfolioImageConfig;
import com.hansung.web.config.PortfolioPdfConfig;
import com.hansung.web.config.SkillImageConfig;

@SpringBootApplication
@EntityScan(basePackageClasses = { DemoApplication.class, Jsr310JpaConverters.class })
@EnableConfigurationProperties({ PortfolioImageConfig.class, AboutImageConfig.class, SkillImageConfig.class, PortfolioPdfConfig.class })
@EnableAspectJAutoProxy
public class DemoApplication {
	@PostConstruct
	void init() {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
	}
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}
