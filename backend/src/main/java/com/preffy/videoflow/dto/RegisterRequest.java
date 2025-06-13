package com.preffy.videoflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "User registration request")
public class RegisterRequest {
    
    @Schema(description = "Unique username for the account", example = "johndoe", required = true)
    @NotBlank(message = "Username is required")
    private String username;
    
    @Schema(description = "Valid email address", example = "john.doe@example.com", required = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @Schema(description = "Password (minimum 6 characters)", example = "securepassword123", required = true, minLength = 6)
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @Schema(description = "Full name of the user", example = "John Doe")
    private String fullName;
    
    // Constructors
    public RegisterRequest() {}
    
    public RegisterRequest(String username, String email, String password, String fullName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
    }
    
    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    // For backwards compatibility
    public String getName() { return fullName != null ? fullName : username; }
    public void setName(String name) { this.fullName = name; }
}
