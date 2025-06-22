package com.preffy.videoflow.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.web.filter.CommonsRequestLoggingFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Configuration
public class LoggingConfig {

    @Bean
    public CommonsRequestLoggingFilter logFilter() {
        CommonsRequestLoggingFilter filter = new CommonsRequestLoggingFilter();
        filter.setIncludeQueryString(true);
        filter.setIncludePayload(true);
        filter.setMaxPayloadLength(10000);
        filter.setIncludeHeaders(false);
        filter.setAfterMessagePrefix("REQUEST DATA: ");
        return filter;
    }

    @Bean
    @Order(1)
    public Filter mdcLoggingFilter() {
        return new OncePerRequestFilter() {
            
            private final Logger requestLogger = LoggerFactory.getLogger("com.preffy.videoflow.request");
            
            @Override
            protected void doFilterInternal(HttpServletRequest request, 
                                          HttpServletResponse response, 
                                          FilterChain filterChain) throws ServletException, IOException {
                
                // Generate correlation ID for request tracking
                String correlationId = UUID.randomUUID().toString();
                String requestId = request.getHeader("X-Request-ID");
                if (requestId == null) {
                    requestId = UUID.randomUUID().toString();
                }
                
                // Add to MDC for logging
                MDC.put("correlationId", correlationId);
                MDC.put("requestId", requestId);
                MDC.put("requestUri", request.getRequestURI());
                MDC.put("requestMethod", request.getMethod());
                MDC.put("userAgent", request.getHeader("User-Agent"));
                MDC.put("remoteAddr", getClientIpAddress(request));
                
                // Add correlation ID to response header
                response.setHeader("X-Correlation-ID", correlationId);
                response.setHeader("X-Request-ID", requestId);
                
                try {
                    long startTime = System.currentTimeMillis();
                    requestLogger.debug("Incoming request: {} {} from {}", 
                               request.getMethod(), 
                               request.getRequestURI(), 
                               getClientIpAddress(request));
                    
                    filterChain.doFilter(request, response);
                    
                    long duration = System.currentTimeMillis() - startTime;
                    requestLogger.info("Request completed: {} {} - Status: {} - Duration: {}ms", 
                              request.getMethod(), 
                              request.getRequestURI(),
                              response.getStatus(),
                              duration);
                              
                } finally {
                    // Clean up MDC
                    MDC.clear();
                }
            }
            
            private String getClientIpAddress(HttpServletRequest request) {
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    return xForwardedFor.split(",")[0].trim();
                }
                
                String xRealIp = request.getHeader("X-Real-IP");
                if (xRealIp != null && !xRealIp.isEmpty()) {
                    return xRealIp;
                }
                
                return request.getRemoteAddr();
            }
        };
    }
}
