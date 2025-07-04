package com.example.BE.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceResponse {

    String serviceId;
    String name;
    int min_price;
    int max_price;
    int duration;
    String description;
}
