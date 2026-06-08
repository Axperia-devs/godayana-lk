FROM openjdk:17-jdk-slim AS build
WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY common ../common/
COPY services/notification-service/pom.xml services/notification-service/

RUN ./mvnw dependency:go-offline -B

COPY services/notification-service/src services/notification-service/src

RUN ./mvnw clean package -DskipTests -pl services/notification-service -am

FROM openjdk:17-jdk-slim
WORKDIR /app

COPY --from=build /app/services/notification-service/target/*.jar app.jar

EXPOSE 8089

ENTRYPOINT ["java", "-jar", "app.jar"]