# STAGE 1: Builder
FROM eclipse-temurin:22-jdk-alpine AS builder
WORKDIR /app

# Copy Gradle files for dependency caching
COPY gradlew .
COPY gradle gradle/
COPY build.gradle .
COPY settings.gradle .

# Make gradlew executable
RUN chmod +x ./gradlew

# Download dependencies
RUN ./gradlew dependencies --no-daemon

# Copy source code and build the application
COPY src src/
RUN ./gradlew build -x test --no-daemon


# STAGE 2: Production Runtime
FROM eclipse-temurin:22-jre-alpine

# Install curl for health checks (if needed, but Cloud Run's are primary)
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -S -g 1001 spring && adduser -S -u 1001 spring -G spring

WORKDIR /app

# **CHANGE 1: Use a wildcard to copy the JAR**
# This is more robust and won't break if the version number changes.
COPY --from=builder /app/build/libs/*[!plain].jar app.jar

# Change ownership to the non-root user
RUN chown spring:spring app.jar

# Switch to the non-root user
USER spring

EXPOSE 8080

# **CHANGE 2: Use JAVA_TOOL_OPTIONS for JVM settings**
# This is the standard way to pass options to any JVM.
ENV JAVA_TOOL_OPTIONS="-Xmx512m -Xms256m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
ENV SPRING_PROFILES_ACTIVE=mysql

# **CHANGE 3: Use the 'exec' form of ENTRYPOINT for graceful shutdowns**
# This ensures the Java process is PID 1 and receives signals correctly from Cloud Run.
ENTRYPOINT ["java", "-jar", "app.jar"]