package com.pryme.loan.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI prymeOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Pryme Loan API")
                        .description("Backend API for Pryme Fintech - Phase 2 (Security Enabled)")
                        .version("v1.0"))
                // 1. Add Security Requirement (The Lock Icon)
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                // 2. Define the Security Scheme (JWT)
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", createAPIKeyScheme()));
    }

    private SecurityScheme createAPIKeyScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .bearerFormat("JWT")
                .scheme("bearer");
    }
}