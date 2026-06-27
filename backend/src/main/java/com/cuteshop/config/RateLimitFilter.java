package com.cuteshop.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter implements Filter {

    // Lưu bucket theo IP
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    // Auth endpoints: 10 requests / 1 phút
    private Bucket authBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1))))
                .build();
    }

    // API chung: 100 requests / 1 phút
    private Bucket apiBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1))))
                .build();
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request  = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String ip   = getClientIp(request);
        String path = request.getRequestURI();

        // Chọn bucket phù hợp
        boolean isAuth = path.contains("/auth/login") || path.contains("/auth/register");
        String key = (isAuth ? "auth:" : "api:") + ip;

        Bucket bucket = buckets.computeIfAbsent(key, k -> isAuth ? authBucket() : apiBucket());

        if (bucket.tryConsume(1)) {
            // Thêm headers thông tin còn lại
            response.addHeader("X-RateLimit-Remaining", String.valueOf(bucket.getAvailableTokens()));
            chain.doFilter(req, res);
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("""
                {
                  "success": false,
                  "message": "Quá nhiều yêu cầu, vui lòng thử lại sau 1 phút."
                }
                """);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isEmpty()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}