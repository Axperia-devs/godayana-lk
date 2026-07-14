package com.godayana.gateway.filter;

import com.godayana.gateway.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.PathContainer;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.util.pattern.PathPattern;
import org.springframework.web.util.pattern.PathPatternParser;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtUtil jwtUtil;
    private final PathPatternParser patternParser = new PathPatternParser();

    // Public endpoints that don't require authentication
    private final List<PathPattern> PUBLIC_ENDPOINTS = List.of(
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/refresh",
            "/api/v1/otp/send",
            "/api/v1/otp/verify",
            "/actuator/health",
            "/api/v1/jobs/public",
            "/api/v1/courses/public",
            "/api/v1/visa/public",
            "/api/v1/stories/public").stream().map(patternParser::parse).collect(Collectors.toList());

    // Admin only endpoints
    private final List<PathPattern> ADMIN_ENDPOINTS = List.of(
            "/api/v1/admin/**",
            "/api/v1/jobs/pending",
            "/api/v1/jobs/*/approve",
            "/api/v1/jobs/*/reject",
            "/api/v1/users/admin/**").stream().map(patternParser::parse).collect(Collectors.toList());

    // Company only endpoints
    private final List<PathPattern> COMPANY_ENDPOINTS = List.of(
            "/api/v1/jobs",
            "/api/v1/jobs/*",
            "/api/v1/jobs/*/close",
            "/api/v1/jobs/*/delete",
            "/api/v1/jobs/company",
            "/api/v1/applications/job/*").stream().map(patternParser::parse).collect(Collectors.toList());

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // Skip authentication for public endpoints
        if (isPublicEndpoint(path)) {
            log.debug("Public endpoint accessed: {}", path);
            return chain.filter(exchange);
        }

        // Extract token from Authorization header
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Missing or invalid Authorization header for path: {}", path);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        // Validate token
        if (!jwtUtil.validateToken(token)) {
            log.warn("Invalid or expired token for path: {}", path);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // Extract user information from token
        String userId = jwtUtil.extractUserId(token);
        String userRole = jwtUtil.extractRole(token);
        String userEmail = jwtUtil.extractEmail(token);

        // Check role-based access
        if (!hasPermission(path, userRole)) {
            log.warn("Access denied: User {} with role {} tried to access {}", userId, userRole, path);
            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
            return exchange.getResponse().setComplete();
        }

        log.debug("Authenticated request - User: {}, Role: {}, Path: {}", userId, userRole, path);

        // Add user information to request headers for downstream services
        ServerHttpRequest mutatedRequest = request.mutate()
                .header("X-User-Id", userId)
                .header("X-User-Role", userRole)
                .header("X-User-Email", userEmail)
                .build();

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    private boolean isPublicEndpoint(String path) {
        return PUBLIC_ENDPOINTS.stream().anyMatch(pattern -> pattern.matches(PathContainer.parsePath(path)));
    }

    private boolean hasPermission(String path, String role) {
        // DEV has all permissions
        if ("DEV".equals(role)) {
            return true;
        }

        // Admin can access admin endpoints
        if ("ADMIN".equals(role)) {
            if (ADMIN_ENDPOINTS.stream().anyMatch(pattern -> pattern.matches(PathContainer.parsePath(path)))) {
                return true;
            }
            // Admin can also access company and seeker endpoints
            return !path.startsWith("/api/v1/admin/");
        }

        // Company permissions
        if ("COMPANY".equals(role)) {
            if (COMPANY_ENDPOINTS.stream().anyMatch(pattern -> pattern.matches(PathContainer.parsePath(path)))) {
                return true;
            }
            // Company can also access job list
            return !path.startsWith("/api/v1/admin/") &&
                    !path.startsWith("/api/v1/seeker/");
        }

        // Seeker permissions (most restricted)
        if ("SEEKER".equals(role)) {
            // Seeker can access seeker endpoints and view jobs
            return !path.startsWith("/api/v1/admin/") &&
                    !path.startsWith("/api/v1/company/") &&
                    !path.startsWith("/api/v1/jobs") &&
                    !path.startsWith("/api/v1/applications");
        }

        return false;
    }

    @Override
    public int getOrder() {
        return -100; // Run before other filters
    }
}