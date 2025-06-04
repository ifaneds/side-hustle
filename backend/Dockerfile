# Use an official OpenJDK image as a base
FROM eclipse-temurin:17-jdk-focal

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper, pom.xml, and src directory into the container
# This leverages Docker's build cache
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Grant execute permission to the Maven wrapper (crucial for Linux)
# This explicitly ensures it's executable within the Docker container
RUN chmod +x mvnw

# Build the application using Maven wrapper
# -DskipTests to skip tests during build
RUN ./mvnw clean package -DskipTests

# Expose the port your Spring Boot app runs on (default is 8080)
EXPOSE 8080

# Define the command to run your application
# This assumes your build creates a JAR file in target/
ENTRYPOINT ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]