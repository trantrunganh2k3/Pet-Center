package com.example.BE.repository;

import com.example.BE.entity.Staff;
import com.example.BE.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, String> {

    Optional<Staff> findByStaffId(String userId);
}
