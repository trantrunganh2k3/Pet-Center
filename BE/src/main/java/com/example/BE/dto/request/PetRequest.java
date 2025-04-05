package com.example.BE.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetRequest {

    String name;
    String species;
    int age;
    float weight;
    String gender;
    String color;
}
