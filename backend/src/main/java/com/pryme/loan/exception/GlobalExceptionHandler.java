//package com.pryme.loan.exception;
//
//import com.pryme.loan.dto.ErrorResponse;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.access.AccessDeniedException;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//import java.time.LocalDateTime;
//import java.util.HashMap;
//import java.util.Map;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//
//    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
//
//    // 1. Handle Resource Not Found (404)
//    @ExceptionHandler(ResourceNotFoundException.class)
//    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
//        logger.warn("Resource Not Found: {}", ex.getMessage());
//        ErrorResponse error = new ErrorResponse(
//                "NOT_FOUND",
//                ex.getMessage(),
//                LocalDateTime.now()
//        );
//        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
//    }
//
//    // 2. Handle Business Logic Errors (400) - e.g. "Duplicate Slug"
//    @ExceptionHandler(BusinessException.class)
//    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
//        logger.warn("Business Error: {}", ex.getMessage());
//        ErrorResponse error = new ErrorResponse(
//                "BUSINESS_ERROR",
//                ex.getMessage(),
//                LocalDateTime.now()
//        );
//        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
//    }
//
//    // 3. Handle Validation Errors (e.g., @NotNull, @Email failed)
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
//        Map<String, String> errors = new HashMap<>();
//        ex.getBindingResult().getFieldErrors().forEach(error ->
//                errors.put(error.getField(), error.getDefaultMessage())
//        );
//
//        logger.warn("Validation Failed: {}", errors);
//
//        ErrorResponse errorResponse = new ErrorResponse(
//                "VALIDATION_FAILED",
//                "Input validation failed",
//                errors, // The specific field errors
//                LocalDateTime.now()
//        );
//        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
//    }
//
//    // 4. Handle Security/Auth Errors
//    @ExceptionHandler({BadCredentialsException.class, AccessDeniedException.class})
//    public ResponseEntity<ErrorResponse> handleAuthErrors(Exception ex) {
//        logger.warn("Auth Error: {}", ex.getMessage());
//        ErrorResponse error = new ErrorResponse(
//                "ACCESS_DENIED",
//                "You do not have permission or credentials are wrong",
//                LocalDateTime.now()
//        );
//        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
//    }
//
//    // 5. Handle Everything Else (500)
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
//        logger.error("CRITICAL SYSTEM FAILURE: ", ex);
//        ErrorResponse error = new ErrorResponse(
//                "INTERNAL_SERVER_ERROR",
//                "An unexpected error occurred. Please contact support.",
//                LocalDateTime.now()
//        );
//        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//}