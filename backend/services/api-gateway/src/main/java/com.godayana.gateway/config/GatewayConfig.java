package com.godayana.gateway.config;

import com.godayana.gateway.handler.FallbackHandler;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class GatewayConfig {

        @Value("${AUTH_SERVICE_URL:http://localhost:8081}")
        private String authServiceUrl;

        @Value("${OTP_SERVICE_URL:http://localhost:8090}")
        private String otpServiceUrl;

        @Value("${USER_SERVICE_URL:http://localhost:8082}")
        private String userServiceUrl;

        @Value("${NOTIFICATION_SERVICE_URL:http://localhost:8083}")
        private String notificationServiceUrl;

        @Value("${JOB_SERVICE_URL:http://localhost:8084}")
        private String jobServiceUrl;

        @Value("${COURSE_SERVICE_URL:http://localhost:8085}")
        private String courseServiceUrl;

        @Value("${VISA_SERVICE_URL:http://localhost:8086}")
        private String visaServiceUrl;

        @Value("${COUNTRY_SERVICE_URL:http://localhost:8087}")
        private String countryServiceUrl;

        @Value("${STORY_SERVICE_URL:http://localhost:8088}")
        private String storyServiceUrl;

        @Value("${PAYMENT_SERVICE_URL:http://localhost:8089}")
        private String paymentServiceUrl;

        @Value("${ADMIN_SERVICE_URL:http://localhost:8090}")
        private String adminServiceUrl;

        @Bean
        public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
                return builder.routes()
                                // Auth Service Routes
                                .route("auth-service", r -> r
                                                .path("/api/v1/auth/**")
                                                .filters(f -> f
                                                                .circuitBreaker(config -> config
                                                                                .setName("authService")
                                                                                .setFallbackUri("forward:/fallback/auth"))
                                                                .retry(config -> config
                                                                                .setRetries(3)
                                                                                .setStatuses(HttpStatus.INTERNAL_SERVER_ERROR,
                                                                                                HttpStatus.SERVICE_UNAVAILABLE))
                                                                .stripPrefix(0))
                                                // .uri("lb://AUTH-SERVICE"))
                                                //.uri("http://localhost:8081"))
                                                .uri(authServiceUrl))

                                // OTP Service Routes
                                .route("otp-service", r -> r
                                                .path("/api/v1/otp/**")
                                                .filters(f -> f
                                                                .circuitBreaker(config -> config
                                                                                .setName("otpService")
                                                                                .setFallbackUri("forward:/fallback/otp"))
                                                                .retry(config -> config
                                                                                .setRetries(2))
                                                                .stripPrefix(0))
                                                // .uri("lb://OTP-SERVICE"))
                                                //.uri("http://localhost:8090"))
                                                .uri(otpServiceUrl))

                                // User Service Routes
                                .route("user-service", r -> r
                                                .path("/api/v1/users/**", "/api/v1/profiles/**",
                                                                "/api/v1/seeker/**", "/api/v1/company/**")
                                                .filters(f -> f
                                                                .circuitBreaker(config -> config
                                                                                .setName("userService")
                                                                                .setFallbackUri("forward:/fallback/user"))
                                                                .stripPrefix(0))
                                                // .uri("lb://USER-SERVICE"))
                                                //.uri("http://localhost:8082"))
                                                .uri(userServiceUrl))

                                // Notification Service Routes
                                .route("notification-service", r -> r
                                                .path("/api/v1/notifications/**")
                                                .filters(f -> f
                                                                .circuitBreaker(config -> config
                                                                                .setName("notificationService")
                                                                                .setFallbackUri("forward:/fallback/notification"))
                                                                .stripPrefix(0))
                                                //.uri("lb://NOTIFICATION-SERVICE"))
                                                //.uri("http://localhost:8083"))
                                                .uri(notificationServiceUrl))

                                // Job Service Routes
                                .route("job-service", r -> r
                                                .path("/api/v1/jobs/**", "/api/v1/applications/**")
                                                .filters(f -> f
                                                                .circuitBreaker(config -> config
                                                                                .setName("jobService")
                                                                                .setFallbackUri("forward:/fallback/job"))
                                                                .stripPrefix(0))
                                                //.uri("lb://JOB-SERVICE"))
                                                //.uri("http://localhost:8084"))
                                                .uri(jobServiceUrl))

                                // Course Service Routes
                                .route("course-service", r -> r
                                                .path("/api/v1/courses/**")
                                                .filters(f -> f
                                                                .circuitBreaker(config -> config
                                                                                .setName("courseService")
                                                                                .setFallbackUri("forward:/fallback/course"))
                                                                .stripPrefix(0))
                                                //.uri("lb://COURSE-SERVICE"))
                                                //.uri("http://localhost:8085"))
                                                .uri(courseServiceUrl))

                                // Visa Service Routes
                                .route("visa-service", r -> r
                                                .path("/api/v1/visa/**")
                                                .filters(f -> f
                                                                .circuitBreaker(config -> config
                                                                                .setName("visaService")
                                                                                .setFallbackUri("forward:/fallback/visa"))
                                                                .stripPrefix(0))
                                                //.uri("lb://VISA-SERVICE"))
                                                //.uri("http://localhost:8086"))
                                                .uri(visaServiceUrl))

                                // Country Service Routes
                                .route("country-service", r -> r
                                                .path("/api/v1/countries/**")
                                                .filters(f -> f
                                                                .circuitBreaker(config -> config
                                                                                .setName("countryService")
                                                                                .setFallbackUri("forward:/fallback/country"))
                                                                .stripPrefix(0))
                                                //.uri("lb://COUNTRY-SERVICE"))
                                                //.uri("http://localhost:8087"))
                                                .uri(countryServiceUrl))

                                // Story Service Routes
                                .route("story-service", r -> r
                                                .path("/api/v1/stories/**")
                                                .filters(f -> f
                                                                .circuitBreaker(config -> config
                                                                                .setName("storyService")
                                                                                .setFallbackUri("forward:/fallback/story"))
                                                                .stripPrefix(0))
                                                //.uri("lb://STORY-SERVICE"))
                                                //.uri("http://localhost:8088"))
                                                .uri(storyServiceUrl))

                                // Payment Service Routes
                                .route("payment-service", r -> r
                                                .path("/api/v1/payments/**")
                                                .filters(f -> f
                                                                .circuitBreaker(config -> config
                                                                                .setName("paymentService")
                                                                                .setFallbackUri("forward:/fallback/payment"))
                                                                .stripPrefix(0))
                                                //.uri("lb://PAYMENT-SERVICE"))
                                                //.uri("http://localhost:8089"))
                                                .uri(paymentServiceUrl))

                                // Admin Service Routes
                                .route("admin-service", r -> r
                                                .path("/api/v1/admin/**")
                                                .filters(f -> f
                                                                .circuitBreaker(config -> config
                                                                                .setName("adminService")
                                                                                .setFallbackUri("forward:/fallback/admin"))
                                                                .stripPrefix(0))
                                                //.uri("lb://ADMIN-SERVICE"))
                                                //.uri("http://localhost:8090"))
                                                .uri(adminServiceUrl))

                                .build();
        }

        @Bean
        public RouterFunction<ServerResponse> fallbackRoutes(FallbackHandler fallbackHandler) {
                return RouterFunctions.route()
                                .GET("/fallback/auth", fallbackHandler::handleAuthFallback)
                                .POST("/fallback/auth", fallbackHandler::handleAuthFallback)
                                .PUT("/fallback/auth", fallbackHandler::handleAuthFallback)
                                .DELETE("/fallback/auth", fallbackHandler::handleAuthFallback)

                                .GET("/fallback/user", fallbackHandler::handleUserFallback)
                                .POST("/fallback/user", fallbackHandler::handleUserFallback)
                                .PUT("/fallback/user", fallbackHandler::handleUserFallback)
                                .DELETE("/fallback/user", fallbackHandler::handleUserFallback)

                                .GET("/fallback/otp", fallbackHandler::handleOtpFallback)
                                .POST("/fallback/otp", fallbackHandler::handleOtpFallback)
                                .PUT("/fallback/otp", fallbackHandler::handleOtpFallback)
                                .DELETE("/fallback/otp", fallbackHandler::handleOtpFallback)

                                .GET("/fallback/notification", fallbackHandler::handleNotificationFallback)
                                .POST("/fallback/notification", fallbackHandler::handleNotificationFallback)
                                .PUT("/fallback/notification", fallbackHandler::handleNotificationFallback)
                                .DELETE("/fallback/notification", fallbackHandler::handleNotificationFallback)

                                .GET("/fallback/job", fallbackHandler::handleJobFallback)
                                .GET("/fallback/**", fallbackHandler::handleGenericFallback)
                                .POST("/fallback/**", fallbackHandler::handleGenericFallback)
                                .PUT("/fallback/**", fallbackHandler::handleGenericFallback)
                                .DELETE("/fallback/**", fallbackHandler::handleGenericFallback)
                                .build();
        }
}