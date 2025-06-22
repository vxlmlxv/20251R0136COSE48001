package com.preffy.videoflow.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, WebRequest request) {
        String correlationId = MDC.get("correlationId");
        String userId = MDC.get("userId");
        
        logger.error("Unhandled exception occurred - CorrelationId: {}, UserId: {}, URI: {}", 
                    correlationId, userId, request.getDescription(false), ex);

        ErrorResponse errorResponse = new ErrorResponse(
                "INTERNAL_SERVER_ERROR",
                "An unexpected error occurred",
                LocalDateTime.now(),
                correlationId
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex, WebRequest request) {
        String correlationId = MDC.get("correlationId");
        String userId = MDC.get("userId");
        
        logger.error("Runtime exception occurred - CorrelationId: {}, UserId: {}, URI: {}", 
                    correlationId, userId, request.getDescription(false), ex);

        ErrorResponse errorResponse = new ErrorResponse(
                "BAD_REQUEST",
                ex.getMessage(),
                LocalDateTime.now(),
                correlationId
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        String correlationId = MDC.get("correlationId");
        
        logger.warn("Authentication exception - CorrelationId: {}, URI: {}, Message: {}", 
                   correlationId, request.getDescription(false), ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                "UNAUTHORIZED",
                "Authentication failed",
                LocalDateTime.now(),
                correlationId
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        String correlationId = MDC.get("correlationId");
        String userId = MDC.get("userId");
        
        logger.warn("Access denied - CorrelationId: {}, UserId: {}, URI: {}, Message: {}", 
                   correlationId, userId, request.getDescription(false), ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                "ACCESS_DENIED",
                "Access denied",
                LocalDateTime.now(),
                correlationId
        );

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex, WebRequest request) {
        String correlationId = MDC.get("correlationId");
        String userId = MDC.get("userId");
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        logger.warn("Validation failed - CorrelationId: {}, UserId: {}, URI: {}, Errors: {}", 
                   correlationId, userId, request.getDescription(false), errors);

        ErrorResponse errorResponse = new ErrorResponse(
                "VALIDATION_FAILED",
                "Validation failed",
                LocalDateTime.now(),
                correlationId,
                errors
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException ex, WebRequest request) {
        String correlationId = MDC.get("correlationId");
        String userId = MDC.get("userId");
        
        logger.warn("File upload size exceeded - CorrelationId: {}, UserId: {}, URI: {}, MaxSize: {}", 
                   correlationId, userId, request.getDescription(false), ex.getMaxUploadSize());

        ErrorResponse errorResponse = new ErrorResponse(
                "FILE_TOO_LARGE",
                "File size exceeds maximum allowed size",
                LocalDateTime.now(),
                correlationId
        );

        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(errorResponse);
    }

    // Error Response DTO
    public static class ErrorResponse {
        private String errorCode;
        private String message;
        private LocalDateTime timestamp;
        private String correlationId;
        private Map<String, String> validationErrors;

        public ErrorResponse(String errorCode, String message, LocalDateTime timestamp, String correlationId) {
            this.errorCode = errorCode;
            this.message = message;
            this.timestamp = timestamp;
            this.correlationId = correlationId;
        }

        public ErrorResponse(String errorCode, String message, LocalDateTime timestamp, String correlationId, Map<String, String> validationErrors) {
            this.errorCode = errorCode;
            this.message = message;
            this.timestamp = timestamp;
            this.correlationId = correlationId;
            this.validationErrors = validationErrors;
        }

        // Getters and setters
        public String getErrorCode() { return errorCode; }
        public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
        
        public String getCorrelationId() { return correlationId; }
        public void setCorrelationId(String correlationId) { this.correlationId = correlationId; }
        
        public Map<String, String> getValidationErrors() { return validationErrors; }
        public void setValidationErrors(Map<String, String> validationErrors) { this.validationErrors = validationErrors; }
    }
}
