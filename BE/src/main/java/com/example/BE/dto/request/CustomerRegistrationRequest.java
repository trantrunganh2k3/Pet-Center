package com.example.BE.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerRegistrationRequest {
    // Thông tin User
    String username;
    String password;
    String role;

    // Thông tin Customer
    String name;
    String email;
    String phone;
    String address;
    LocalDate dob;
}
