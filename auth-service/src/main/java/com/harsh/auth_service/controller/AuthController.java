package com.harsh.auth_service.controller;

import com.harsh.auth_service.dto.AuthResponse;
import com.harsh.auth_service.dto.LoginRequest;
import com.harsh.auth_service.dto.SignupRequest;
import com.harsh.auth_service.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name="Auth API", description="Signup/Login JWT endpoints")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary="Signup new USER", description="Creates a USER and returns JWT token")
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @Operation(summary="Login", description="Authenticates user and returns JWT token")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/signup-admin")
    public AuthResponse signupAdmin(@RequestBody SignupRequest request) {
        return authService.signupAdmin(request);
    }
}
