package com.harsh.auth_service.service;

import com.harsh.auth_service.dto.AuthResponse;
import com.harsh.auth_service.dto.LoginRequest;
import com.harsh.auth_service.dto.MeResponse;
import com.harsh.auth_service.dto.SignupRequest;
import com.harsh.auth_service.entity.Role;
import com.harsh.auth_service.entity.User;
import com.harsh.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already exists");

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .enabled(true)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));


        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");
        String token = jwtService.generateToken(user);

        return new AuthResponse(token, user.getRole().name());
    }

    public MeResponse me(User user) {
        return new MeResponse(user.getEmail(), user.getRole().name());
    }

    @Value("${auth.allow-admin-signup:false}")
    private boolean allowAdminSignup;

    public AuthResponse signupAdmin(SignupRequest request) {

        if (!allowAdminSignup) {
            throw new RuntimeException("Admin signup is disabled");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User admin = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        userRepository.save(admin);

        String token = jwtService.generateToken(admin);

        return new AuthResponse(token, admin.getRole().name());
    }
}