package com.hansung.web.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.hansung.web.dto.ApiResponse;

@RestControllerAdvice
public class ControllerAdvice {
	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> exceptionHandler(Exception e) {
		return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
	}

	@ExceptionHandler(AppException.class)
	public ResponseEntity<?> appExceptionHandler(AppException e) {
		return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
	}

	@ExceptionHandler(FileStorageException.class)
	public ResponseEntity<?> fileStorageExceptionHandler(Exception e) {
		return ResponseEntity.badRequest().body(e);
	}
}