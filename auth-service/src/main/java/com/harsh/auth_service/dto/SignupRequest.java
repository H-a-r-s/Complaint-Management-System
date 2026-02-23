package com.harsh.auth_service.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class SignupRequest {
    private String email;
    private String password;
}