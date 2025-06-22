package com.preffy.videoflow.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AbstractAuthenticationEvent;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class SecurityEventLogger {

    private static final Logger securityLogger = LoggerFactory.getLogger("com.preffy.videoflow.security");

    @EventListener
    public void onAuthenticationSuccess(AuthenticationSuccessEvent event) {
        Authentication auth = event.getAuthentication();
        String username = auth.getName();
        
        // Add user ID to MDC for subsequent logs
        if (auth.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            MDC.put("userId", username);
        }
        
        securityLogger.info("Authentication successful for user: {}", username);
    }

    @EventListener
    public void onAuthenticationFailure(AuthenticationFailureBadCredentialsEvent event) {
        String username = event.getAuthentication().getName();
        securityLogger.warn("Authentication failed for user: {} - Reason: Bad credentials", username);
    }

    @EventListener
    public void onAuthenticationEvent(AbstractAuthenticationEvent event) {
        if (!(event instanceof AuthenticationSuccessEvent) && 
            !(event instanceof AuthenticationFailureBadCredentialsEvent)) {
            securityLogger.debug("Authentication event: {} for user: {}", 
                               event.getClass().getSimpleName(), 
                               event.getAuthentication().getName());
        }
    }
}
