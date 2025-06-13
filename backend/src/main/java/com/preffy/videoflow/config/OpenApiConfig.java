package com.preffy.videoflow.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI preffyVideoFlowOpenAPI() {
        final String securitySchemeName = "Bearer Authentication";
        
        return new OpenAPI()
                .info(new Info()
                        .title("Preffy Video Flow API")
                        .description("A modern video feedback platform API built with Spring Boot that helps users analyze and improve their video presentations through AI-powered feedback.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Preffy Video Flow Team")
                                .email("support@preffyvideoflow.com")
                                .url("https://github.com/your-repo/preffy-video-flow"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Development Server"),
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
                                .description("JWT Bearer Token Authentication. Format: Bearer {token}")));
    }
}
