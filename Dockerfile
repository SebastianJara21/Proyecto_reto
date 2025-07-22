# Etapa build
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .mvn mvnw ./
COPY src ./src
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Etapa runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
