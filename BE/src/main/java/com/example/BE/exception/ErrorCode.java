package com.example.BE.exception;


import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    INVALID_KEY(1001, "Invalid key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User already existed", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1003, "Password invalid", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1004, "User not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1005, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1006, "You do not have permission", HttpStatus.FORBIDDEN),
    CUSTOMER_EXISTED(1007, "Customer already existed", HttpStatus.BAD_REQUEST),
    CUSTOMER_NOT_FOUND(1008, "Customer not found", HttpStatus.NOT_FOUND),
    STAFF_EXISTED(1009, "Staff already existed", HttpStatus.BAD_REQUEST),
    STAFF_NOT_FOUND(1010, "Staff not found", HttpStatus.NOT_FOUND),
    PET_NOT_FOUND(1011, "Pet not found", HttpStatus.NOT_FOUND),
    UNCATEGORIZED(9999, "Uncategorized", HttpStatus.INTERNAL_SERVER_ERROR),

    ;

    private int code;
    private String message;
    private HttpStatusCode httpStatusCode;
    private ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }

}
