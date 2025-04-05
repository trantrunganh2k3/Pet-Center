package com.example.BE.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "staff")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String staffId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    User user;

    String name;
    String phone;
    String email;
    String address;


}
