package com.cuteshop.controller;

import com.cuteshop.dto.request.AuthRequest;
import com.cuteshop.dto.response.ResponseDTOs.*;
import com.cuteshop.entity.User;
import com.cuteshop.repository.UserRepository;
import com.cuteshop.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PutMapping("/auth/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@RequestBody java.util.Map<String, String> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        if (body.get("fullName") != null) user.setFullName(body.get("fullName"));
        if (body.get("phone") != null) user.setPhone(body.get("phone"));
        if (body.get("address") != null) user.setAddress(body.get("address"));
        if (body.get("city") != null) user.setCity(body.get("city"));
        if (body.get("province") != null) user.setProvince(body.get("province"));
        return ResponseEntity.ok(ApiResponse.success(toUserResponse(userRepository.save(user))));
    }

    @PutMapping("/auth/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody java.util.Map<String, String> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        if (!passwordEncoder.matches(body.get("currentPassword"), user.getPassword())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mật khẩu hiện tại không đúng"));
        }
        user.setPassword(passwordEncoder.encode(body.get("newPassword")));
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody AuthRequest.Register req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Email already in use"));
        }
        User user = User.builder()
            .fullName(req.getFullName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .phone(req.getPhone())
            .role(User.Role.CUSTOMER)
            .build();
        userRepository.save(user);

        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        String token = jwtUtils.generateToken(auth);
        return ResponseEntity.ok(ApiResponse.success(buildAuthResponse(user, token)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest.Login req) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        String token = jwtUtils.generateToken(auth);
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success(buildAuthResponse(user, token)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success(toUserResponse(user)));
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
            .accessToken(token).tokenType("Bearer")
            .user(toUserResponse(user)).build();
    }

    private UserResponse toUserResponse(User u) {
        return UserResponse.builder()
            .id(u.getId()).fullName(u.getFullName()).email(u.getEmail())
            .phone(u.getPhone()).address(u.getAddress()).city(u.getCity())
            .province(u.getProvince()).role(u.getRole().name())
            .createdAt(u.getCreatedAt()).build();
    }
}