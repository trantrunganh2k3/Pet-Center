package com.example.BE.exception;

import com.example.BE.dto.request.ApiResponse;
import jakarta.validation.ConstraintViolation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;
import java.util.Objects;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final String MIN_ATTRIBUTE = "min";

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse> runtimeExceptionHandler(RuntimeException e) {

        return ResponseEntity
                .status(ErrorCode.UNCATEGORIZED.getHttpStatusCode())
                .body(
                        ApiResponse.builder()
                                .code(ErrorCode.UNCATEGORIZED.getCode())
                                .message(ErrorCode.UNCATEGORIZED.getMessage())
                                .build()
                );

    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException e) {

        ErrorCode errorCode = e.getErrorCode();

        return ResponseEntity
                .status(errorCode.getHttpStatusCode())
                .body(
                        ApiResponse.builder()
                                .code(errorCode.getCode())
                                .message(errorCode.getMessage())
                                .build()
                );
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse> handlingAccessDeniedException(AccessDeniedException e) {

        return ResponseEntity
                .status(ErrorCode.UNAUTHORIZED.getHttpStatusCode())
                .body(
                        ApiResponse.builder()
                                .code(ErrorCode.UNAUTHORIZED.getCode())
                                .message(ErrorCode.UNAUTHORIZED.getMessage())
                                .build()
                );
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException e) {
        String enumKey = e.getFieldError().getDefaultMessage();
        ErrorCode errorCode = ErrorCode.INVALID_KEY;

        Map<String, Object> attributes = null;
        try{
            errorCode = ErrorCode.valueOf(enumKey);

            var constraintViolations = e.getBindingResult()
                    .getAllErrors().getFirst().unwrap(ConstraintViolation.class);

            attributes = constraintViolations.getConstraintDescriptor().getAttributes();


        }catch (IllegalArgumentException ignored){

        }

        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(Objects.nonNull(attributes) ?
                mapAttribute(errorCode.getMessage(), attributes)
                : errorCode.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }

    private String mapAttribute(String message, Map<String, Object> attributes) {
        String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));

        return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
    }

}
