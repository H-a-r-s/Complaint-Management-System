# Use lightweight Java 21 image
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy jar file
COPY target/*.jar app.jar

# Expose port (Render will override using PORT env)
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java","-jar","app.jar"]