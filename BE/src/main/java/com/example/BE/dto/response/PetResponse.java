package com.example.BE.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PetResponse {

    String petId;
    String name;
    String species;
    int age;
    float weight;
    String gender;
    String color;
}
