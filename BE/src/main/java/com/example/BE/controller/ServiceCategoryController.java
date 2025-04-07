package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.PetRequest;
import com.example.BE.dto.request.ServiceCategoryRequest;
import com.example.BE.dto.response.PetResponse;
import com.example.BE.dto.response.ServiceCategoryResponse;
import com.example.BE.dto.response.ServiceResponse;
import com.example.BE.repository.CustomerRepository;
import com.example.BE.repository.PetRepository;
import com.example.BE.repository.ServiceCategoryRepository;
import com.example.BE.service.CustomerService;
import com.example.BE.service.PetService;
import com.example.BE.service.ServiceCategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/service_category")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServiceCategoryController {

    PetRepository petRepository;
    PetService petService;

    CustomerService customerService;
    CustomerRepository customerRepository;

    ServiceCategoryRepository serviceCategoryRepository;
    ServiceCategoryService serviceCategoryService;

    @PostMapping
    ApiResponse<ServiceCategoryResponse> createServiceCategory(@RequestBody @Valid ServiceCategoryRequest request) {
        return ApiResponse.<ServiceCategoryResponse>builder()
                .result(serviceCategoryService.create(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<ServiceCategoryResponse>> getAllServiceCategory() {

        return ApiResponse.<List<ServiceCategoryResponse>>builder()
                .result(serviceCategoryService.getAll())
                .build();
    }

}
