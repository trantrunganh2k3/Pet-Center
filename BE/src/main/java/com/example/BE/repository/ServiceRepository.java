package com.example.BE.repository;

import com.example.BE.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Services, String> {

    List<Services> findByCategoryCateId(String cateId);
}
