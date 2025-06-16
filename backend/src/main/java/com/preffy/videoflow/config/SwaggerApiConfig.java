
package com.preffy.videoflow.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerApiConfig {

    @Bean
    public OpenAPI preffyVideoFlowOpenAPI() {
        final String securitySchemeName = "Bearer Authentication";
        
        return new OpenAPI()
                .info(new Info()
                        .title("Preffy Video Flow API")
                        .description("""
                            A comprehensive video presentation feedback platform API that provides:
                            
                            **Core Features:**
                            - 🎥 Video upload and processing
                            - 📝 AI-powered script analysis
                            - 👤 Behavior and body language detection
                            - ⭐ Performance scoring and badges
                            - 💡 Intelligent improvement suggestions
                            - 👥 Multi-user project management
                            
                            **Analysis Capabilities:**
                            - Speech recognition and transcription
                            - Gesture and facial expression analysis
                            - Posture and body language evaluation
                            - Presentation structure assessment
                            - Real-time processing status updates
                            
                            **Authentication:** All endpoints (except health and auth) require JWT Bearer token authentication.
                            """)
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Preffy Video Flow Development Team")
                                .email("developers@preffyvideoflow.com")
                                .url("https://github.com/preffy/video-flow-api"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Local Development Server"),
                        new Server()
                                .url("https://api-dev.preffyvideoflow.com")
                                .description("Development Environment"),
                        new Server()
                                .url("https://api.preffyvideoflow.com")
                                .description("Production Server")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT Bearer Token Authentication. Format: Bearer {token}")))
                .tags(List.of(
                        new Tag()
                                .name("Authentication")
                                .description("User authentication and session management endpoints"),
                        new Tag()
                                .name("Project Management")
                                .description("CRUD operations for presentation projects"),
                        new Tag()
                                .name("Video Processing")
                                .description("Video upload, processing, and status monitoring"),
                        new Tag()
                                .name("Script Analysis")
                                .description("Speech-to-text conversion and script structure analysis"),
                        new Tag()
                                .name("Behavior Analysis") 
                                .description("Body language, gestures, and facial expression detection"),
                        new Tag()
                                .name("Performance Scoring")
                                .description("AI-generated performance scores and badge system"),
                        new Tag()
                                .name("AI Suggestions")
                                .description("Intelligent improvement recommendations"),
                        new Tag()
                                .name("Health Check")
                                .description("Service health monitoring and status endpoints")
                ));
    }
}
