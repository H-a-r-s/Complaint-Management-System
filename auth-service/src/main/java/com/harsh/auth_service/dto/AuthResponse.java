package com.harsh.auth_service.dto;


import lombok.*;


@Data
@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
}