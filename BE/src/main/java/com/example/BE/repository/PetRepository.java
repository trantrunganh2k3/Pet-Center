package com.example.BE.repository;

import com.example.BE.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, String> {
    List<Pet> findByCustomerCustomerId(String customerId);
}
