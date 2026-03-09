package com.pryme.loan.dto;

import lombok.Data; // Keep Lombok just in case, but methods below ensure it works

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String mobile;
    private String password;
    private String role; // Optional, defaults to USER in service

    // MANUAL GETTERS & SETTERS (To fix your error)
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}