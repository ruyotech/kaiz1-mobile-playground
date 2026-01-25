# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and pom
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .

# Download dependencies (cached layer)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Add non-root user for security
RUN addgroup -g 1001 -S kaiz && \
    adduser -u 1001 -S kaiz -G kaiz

# Install curl for health checks
RUN apk add --no-cache curl

# Copy the built jar
COPY --from=builder /app/target/*.jar app.jar

# Change ownership
RUN chown -R kaiz:kaiz /app

# Switch to non-root user
USER kaiz

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health/liveness || exit 1

# Run the application with virtual threads enabled
ENTRYPOINT ["java", \
    "-XX:+UseZGC", \
    "-XX:+ZGenerational", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
