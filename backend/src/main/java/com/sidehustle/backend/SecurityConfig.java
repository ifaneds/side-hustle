package com.sidehustle.backend;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
        .csrf(csrf -> csrf.disable()) //disable CSRF
            .authorizeHttpRequests((authz) -> authz
            
                //.requestMatchers("/api/users").permitAll() // Allow unauthenticated access to /api/users
                //.anyRequest().authenticated() // All other requests require authentication
                .requestMatchers("/**").permitAll() // Allow unauthenticated access to all paths")
            )
            .httpBasic(withDefaults());
        return http.build();
    }

      @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}