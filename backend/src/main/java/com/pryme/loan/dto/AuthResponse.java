package com.pryme.loan.dto;

public record AuthResponse(
        String accessToken,
        UserDto user
) {}