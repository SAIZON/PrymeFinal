package com.pryme.loan.dto;

import java.math.BigDecimal;

public record DashboardStats(
        long activeApplications,
        long unreadNotifications,
        BigDecimal totalExternalDebt
) {}