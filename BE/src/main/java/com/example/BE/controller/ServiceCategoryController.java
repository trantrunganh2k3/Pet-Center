package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.ServiceCategoryRequest;
import com.example.BE.dto.response.ServiceCategoryResponse;
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

    @PutMapping("/{id}")
    ApiResponse<ServiceCategoryResponse> updateServiceCategory(@PathVariable String id, @RequestBody @Valid ServiceCategoryRequest request) {
        return ApiResponse.<ServiceCategoryResponse>builder()
                .result(serviceCategoryService.update(request, id))
                .build();
    }

    @DeleteMapping("/{id}")
    String deleteServiceCategory(@PathVariable String id) {
        serviceCategoryService.delete(id);
        return "Service category deleted";
    }

}
