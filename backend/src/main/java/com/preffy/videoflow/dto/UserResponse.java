package com.preffy.videoflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User profile response")
public class UserResponse {
    
    @Schema(description = "User ID", example = "1")
    private String id;
    
    @Schema(description = "User's full name", example = "John Doe")
    private String name;
    
    @Schema(description = "User's email address", example = "john.doe@example.com")
    private String email;
    
    @Schema(description = "User's avatar URL", example = "https://example.com/avatar.jpg")
    private String avatar;
    
    // Constructors
    public UserResponse() {}
    
    public UserResponse(String id, String name, String email, String avatar) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatar = avatar;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
}
