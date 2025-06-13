package com.preffy.videoflow.dto;

import com.preffy.videoflow.model.User;

public class AuthResponse {
    
    private String accessToken;
    private String tokenType = "Bearer";
    private UserResponse user;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String accessToken, User user) {
        this.accessToken = accessToken;
        this.user = new UserResponse(user);
    }
    
    // Getters and Setters
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
    
    // Inner class for user response
    public static class UserResponse {
        private String id;
        private String name;
        private String email;
        private String locale;
        private String plan;
        
        public UserResponse() {}
        
        public UserResponse(User user) {
            this.id = user.getId().toString();
            this.name = user.getFullName();
            this.email = user.getEmail();
            this.locale = user.getLocale();
            this.plan = user.getPlan().name().toLowerCase();
        }
        
        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getLocale() { return locale; }
        public void setLocale(String locale) { this.locale = locale; }
        
        public String getPlan() { return plan; }
        public void setPlan(String plan) { this.plan = plan; }
    }
}
