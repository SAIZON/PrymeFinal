package com.pryme.loan.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationDto(
        UUID id,
        String title,
        String message,
        String type,
        boolean isRead,
        LocalDateTime createdAt
) {}