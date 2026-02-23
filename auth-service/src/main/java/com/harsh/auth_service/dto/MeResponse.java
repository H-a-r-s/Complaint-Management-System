package com.harsh.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@AllArgsConstructor
public class MeResponse {
    private String email;
    private String role;
}
