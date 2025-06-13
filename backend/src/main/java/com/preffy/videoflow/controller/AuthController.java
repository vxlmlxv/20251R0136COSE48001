package com.preffy.videoflow.controller;

import com.preffy.videoflow.dto.AuthResponse;
import com.preffy.videoflow.dto.LoginRequest;
import com.preffy.videoflow.dto.RegisterRequest;
import com.preffy.videoflow.model.User;
import com.preffy.videoflow.security.JwtTokenProvider;
import com.preffy.videoflow.security.UserPrincipal;
import com.preffy.videoflow.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Authentication", description = "User authentication and registration endpoints")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @PostMapping("/login")
    @Operation(
        summary = "User Login",
        description = "Authenticate user with email and password. Returns JWT token for subsequent API calls.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "User login credentials",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = LoginRequest.class),
                examples = @ExampleObject(
                    name = "Login Example",
                    summary = "Sample login request",
                    value = """
                    {
                        "email": "test@example.com",
                        "password": "testpassword123"
                    }
                    """
                )
            )
        )
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully authenticated",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = AuthResponse.class),
                examples = @ExampleObject(
                    name = "Success Response",
                    value = """
                    {
                        "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
                        "tokenType": "Bearer",
                        "user": {
                            "id": "1",
                            "name": "Test User",
                            "email": "test@example.com",
                            "locale": "en-US",
                            "plan": "free"
                        }
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Invalid credentials",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Error Response",
                    value = """
                    {
                        "success": false,
                        "message": "Invalid email or password"
                    }
                    """
                )
            )
        )
    })
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userService.findById(userPrincipal.getId());
        
        return ResponseEntity.ok(new AuthResponse(jwt, user));
    }
    
    @PostMapping("/register")
    @Operation(
        summary = "User Registration",
        description = "Register a new user account. Returns JWT token for immediate authentication.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "User registration details",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = RegisterRequest.class),
                examples = @ExampleObject(
                    name = "Registration Example",
                    summary = "Sample registration request",
                    value = """
                    {
                        "username": "testuser",
                        "email": "test@example.com",
                        "password": "testpassword123",
                        "fullName": "Test User"
                    }
                    """
                )
            )
        )
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully registered",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = AuthResponse.class),
                examples = @ExampleObject(
                    name = "Success Response",
                    value = """
                    {
                        "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
                        "tokenType": "Bearer",
                        "user": {
                            "id": "1",
                            "name": "Test User",
                            "email": "test@example.com",
                            "locale": "en-US",
                            "plan": "free"
                        }
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Registration failed - email or username already exists",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Error Response",
                    value = """
                    {
                        "success": false,
                        "message": "Email is already in use!"
                    }
                    """
                )
            )
        )
    })
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        try {
            User user = userService.createUser(
                    signUpRequest.getUsername(),
                    signUpRequest.getFullName(),
                    signUpRequest.getEmail(),
                    signUpRequest.getPassword()
            );
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            signUpRequest.getEmail(),
                            signUpRequest.getPassword()
                    )
            );
            
            String jwt = tokenProvider.generateToken(authentication);
            
            return ResponseEntity.ok(new AuthResponse(jwt, user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/profile")
    @Operation(
        summary = "Get Current User Profile",
        description = "Retrieve the profile information of the currently authenticated user.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved user profile",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = AuthResponse.UserResponse.class),
                examples = @ExampleObject(
                    name = "Success Response",
                    value = """
                    {
                        "id": "1",
                        "name": "Test User",
                        "email": "test@example.com",
                        "locale": "en-US",
                        "plan": "free"
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing JWT token",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Error Response",
                    value = """
                    {
                        "error": "Unauthorized",
                        "message": "JWT token is missing or invalid"
                    }
                    """
                )
            )
        )
    })
    public ResponseEntity<?> getCurrentUser(
        @Parameter(hidden = true) Authentication authentication
    ) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userService.findById(userPrincipal.getId());
        
        return ResponseEntity.ok(new AuthResponse.UserResponse(user));
    }
    
    // Simple response class for error messages
    public static class ErrorResponse {
        private Boolean success;
        private String message;
        
        public ErrorResponse(Boolean success, String message) {
            this.success = success;
            this.message = message;
        }
        
        public Boolean getSuccess() { return success; }
        public void setSuccess(Boolean success) { this.success = success; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
