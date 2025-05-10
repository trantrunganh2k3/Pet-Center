package com.example.BE.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.example.BE.entity.Pet;

@Entity
@Table(name = "customer")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String customerId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    User user;

    String name;
    String address;
    String phone;
    String email;
    LocalDate dob;

    // Mối quan hệ One-to-Many với Pet
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<Pet> pets = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<Booking> bookings = new ArrayList<>();
}
