FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY pom.xml mvnw ./
COPY .mvn .mvn
# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build Spring Boot jar
RUN ./mvnw clean package -DskipTests

#RUNTIME STAGE — Run Jar using JRE 21
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the actual jar (crm-system.jar)
COPY --from=builder /app/target/crm-system.jar /app/crm-system.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/crm-system.jar"]
