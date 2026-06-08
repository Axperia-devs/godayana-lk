package com.godayana.gateway.handler;

import com.godayana.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class FallbackHandler {

    public Mono<ServerResponse> handleAuthFallback(ServerRequest request) {
        return ServerResponse
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(ApiResponse.error(
                        "Auth service is temporarily unavailable. Please try again later.",
                        "SERVICE_UNAVAILABLE"
                ));
    }

    public Mono<ServerResponse> handleUserFallback(ServerRequest request) {
        return ServerResponse
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(ApiResponse.error(
                        "User service is temporarily unavailable. Please try again later.",
                        "SERVICE_UNAVAILABLE"
                ));
    }

    public Mono<ServerResponse> handleOtpFallback(ServerRequest request) {
        return ServerResponse
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(ApiResponse.error(
                        "OTP service is temporarily unavailable. Please try again later.",
                        "SERVICE_UNAVAILABLE"
                ));
    }

    public Mono<ServerResponse> handleNotificationFallback(ServerRequest request) {
        return ServerResponse
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(ApiResponse.error(
                        "Notification service is temporarily unavailable. Please try again later.",
                        "SERVICE_UNAVAILABLE"
                ));
    }

    public Mono<ServerResponse> handleJobFallback(ServerRequest request) {
        return ServerResponse
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(ApiResponse.error(
                        "Job service is temporarily unavailable. Please try again later.",
                        "SERVICE_UNAVAILABLE"
                ));
    }

    public Mono<ServerResponse> handleCourseFallback(ServerRequest request) {
        return ServerResponse
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(ApiResponse.error(
                        "Course service is temporarily unavailable. Please try again later.",
                        "SERVICE_UNAVAILABLE"
                ));
    }

    public Mono<ServerResponse> handleVisaFallback(ServerRequest request) {
        return ServerResponse
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(ApiResponse.error(
                        "Visa service is temporarily unavailable. Please try again later.",
                        "SERVICE_UNAVAILABLE"
                ));
    }

    public Mono<ServerResponse> handlePaymentFallback(ServerRequest request) {
        return ServerResponse
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(ApiResponse.error(
                        "Payment service is temporarily unavailable. Please try again later.",
                        "SERVICE_UNAVAILABLE"
                ));
    }

    public Mono<ServerResponse> handleAdminFallback(ServerRequest request) {
        return ServerResponse
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(ApiResponse.error(
                        "Admin service is temporarily unavailable. Please try again later.",
                        "SERVICE_UNAVAILABLE"
                ));
    }

    public Mono<ServerResponse> handleGenericFallback(ServerRequest request) {
        return ServerResponse
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(ApiResponse.error(
                        "Service is temporarily unavailable. Please try again later.",
                        "SERVICE_UNAVAILABLE"
                ));
    }
}