package com.hansung.web.exception;

@SuppressWarnings("serial")
public class DataAlreadyExistsException extends RuntimeException {
    public DataAlreadyExistsException(String message) {
        super(message);
    }
}