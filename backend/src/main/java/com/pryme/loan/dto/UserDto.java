package com.pryme.loan.dto;

import com.pryme.loan.entity.Role;
import java.util.UUID; // Or Long if you haven't switched to UUIDs yet

public record UserDto(
        UUID id,
        String name,
        String email,
        Role role
) {}