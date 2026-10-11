# Dockerfile for Spring Boot Backend
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built jar file
COPY target/clothing-inventory-0.0.1-SNAPSHOT.jar app.jar

# Expose default application port
EXPOSE 8080

# Environment variables with default fallbacks
ENV PORT=8080
ENV SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/clothing_inventory?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=MySQL@123

ENTRYPOINT ["java", "-jar", "app.jar"]
