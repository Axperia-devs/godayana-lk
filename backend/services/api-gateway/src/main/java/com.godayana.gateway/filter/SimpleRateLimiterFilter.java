package com.godayana.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class SimpleRateLimiterFilter implements GlobalFilter, Ordered {

    // Simple in-memory rate limiter (no Redis needed)
    private final Map<String, RateLimitInfo> requestCounts = new ConcurrentHashMap<>();

    private static final int MAX_REQUESTS_PER_MINUTE = 100;
    private static final int TIME_WINDOW_SECONDS = 60;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // Get client identifier (IP or User ID if authenticated)
        String clientId = getClientId(exchange);
        String path = exchange.getRequest().getURI().getPath();

        // Skip rate limiting for health checks and login
        if (shouldSkipRateLimiting(path)) {
            return chain.filter(exchange);
        }

        RateLimitInfo info = requestCounts.computeIfAbsent(clientId, k -> new RateLimitInfo());

        synchronized (info) {
            long currentTime = Instant.now().getEpochSecond();

            // Reset counter if time window has passed
            if (currentTime - info.windowStart > TIME_WINDOW_SECONDS) {
                info.windowStart = currentTime;
                info.requestCount = 0;
            }

            // Check if rate limit exceeded
            if (info.requestCount >= MAX_REQUESTS_PER_MINUTE) {
                log.warn("Rate limit exceeded for client: {}, Path: {}", clientId, path);
                exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
                return exchange.getResponse().setComplete();
            }

            info.requestCount++;
        }

        log.debug("Rate limit OK for client: {}, Count: {}, Path: {}",
                clientId, info.requestCount, path);
        return chain.filter(exchange);
    }

    private String getClientId(ServerWebExchange exchange) {
        // Try to get user ID from header (if authenticated)
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");
        if (userId != null && !userId.isEmpty()) {
            return userId;
        }
        // Fallback to IP address
        return exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
    }

    private boolean shouldSkipRateLimiting(String path) {
        return path.startsWith("/actuator/health") ||
                path.startsWith("/api/v1/auth/login") ||
                path.startsWith("/fallback");
    }

    @Override
    public int getOrder() {
        return -80; // Run before other filters
    }

    private static class RateLimitInfo {
        long windowStart = Instant.now().getEpochSecond();
        int requestCount = 0;
    }
}