# Multi-stage build for optimized production image
FROM eclipse-temurin:22-jdk-alpine AS builder

# Set working directory
WORKDIR /app

# Copy Gradle wrapper and build files first (for better layer caching)
COPY gradlew .
COPY gradle gradle/
COPY build.gradle .
COPY settings.gradle .

# Make gradlew executable
RUN chmod +x ./gradlew

# Download dependencies (cached layer if no changes to build files)
RUN ./gradlew dependencies --no-daemon

# Copy source code
COPY src src/

# Build the application
RUN ./gradlew build -x test --no-daemon

# Production runtime stage
FROM eclipse-temurin:22-jre-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -g 1001 -S spring && \
    adduser -S spring -u 1001 -G spring

# Set working directory
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/build/libs/demo-0.0.1-SNAPSHOT.jar app.jar

# Change ownership to spring user
RUN chown -R spring:spring /app

# Switch to non-root user
USER spring

# Expose port 8080
EXPOSE 8080

# Set JVM options for container environment
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Set default Spring profile
ENV SPRING_PROFILES_ACTIVE=mysql

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Add application metadata
LABEL maintainer="Preffy Video Flow Team" \
      version="1.0" \
      description="Preffy Video Flow Backend Service"

# Run the application with optimized JVM settings
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
