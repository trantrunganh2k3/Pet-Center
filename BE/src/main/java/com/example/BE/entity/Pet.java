package com.example.BE.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "pet")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String petId;

    String name;
    String species;
    int age;
    float weight;
    String gender;
    String color;

    // Mối quan hệ Many-to-One với Customer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customerId", nullable = false)
    Customer customer;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<BookingDetails> bookingDetails = new ArrayList<>();
}