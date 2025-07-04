package com.example.BE.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "services")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Services {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String serviceId;

    String name;
    String description;
    int min_price;
    int max_price;
    int duration;

    // Mối quan hệ Many-to-One với Customer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cateId", nullable = false)
    ServiceCategory category;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    List<BookingDetails> bookingDetails = new ArrayList<>();
}
