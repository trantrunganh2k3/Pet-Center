package com.example.BE.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${openapi.dev-url:http://localhost:8080/petcenter}")
    private String devUrl;

    @Value("${openapi.prod-url:https://api.petcenter.com/petcenter}")
    private String prodUrl;

    @Bean
    public OpenAPI myOpenAPI() {
        // Define servers
        Server devServer = new Server();
        devServer.setUrl(devUrl);
        devServer.setDescription("Server URL in Development environment");

        Server prodServer = new Server();
        prodServer.setUrl(prodUrl);
        prodServer.setDescription("Server URL in Production environment");

        // Contact information
        Contact contact = new Contact();
        contact.setEmail("developer@petcenter.local");
        contact.setName("Pet Center Development Team");

        // API information
        Info info = new Info()
                .title("Pet Center Management API")
                .version("1.0")
                .contact(contact)
                .description("This API exposes endpoints to manage Pet Center operations including customer management, pet care services, booking management, and staff administration. " +
                           "Use /auth/token endpoint to get JWT token for authentication.")
                .termsOfService("Terms of Service: This is a demo API for Pet Center Management System");

        // Security scheme for JWT
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER)
                .name("Authorization");

        // Security requirement
        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("Bearer Authentication");

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer, prodServer))
                .addSecurityItem(securityRequirement)
                .components(new Components().addSecuritySchemes("Bearer Authentication", securityScheme));
    }
}
