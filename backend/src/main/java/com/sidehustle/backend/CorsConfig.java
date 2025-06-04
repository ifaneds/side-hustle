package com.sidehustle.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Allow specific origins
        config.addAllowedOrigin("http://localhost:3000"); // For local React development
        // IMPORTANT: Add your GitHub Pages domain here!
        // This should be the root domain of your GitHub Pages site.
        // For https://ifaneds.github.io/side-hustle/, the origin is https://ifaneds.github.io
        config.addAllowedOrigin("https://ifaneds.github.io");

        // Allow all headers and methods
        config.addAllowedHeader("*");
        config.addAllowedMethod("*"); // Covers GET, POST, PUT, DELETE, OPTIONS, etc.

        // Allow credentials (e.g., cookies, authorization headers)
        config.setAllowCredentials(true);

        // Set max age for preflight requests (how long results of a preflight can be cached)
        config.setMaxAge(3600L); // 1 hour

        source.registerCorsConfiguration("/**", config); // Apply this CORS config to all paths
        return new CorsFilter(source);
    }
}