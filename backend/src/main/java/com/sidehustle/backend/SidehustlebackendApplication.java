package com.sidehustle.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@ComponentScan(basePackages = "com.sidehustle.backend")
@EntityScan("com.sidehustle.backend")
@EnableJpaRepositories("com.sidehustle.backend")
@EnableTransactionManagement
public class SidehustlebackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SidehustlebackendApplication.class, args);
	}

	
}
