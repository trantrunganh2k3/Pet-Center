package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.ServiceRequest;
import com.example.BE.dto.response.ServiceResponse;
import com.example.BE.service.ServiceCenterService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/service_detail")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServiceController {

    ServiceCenterService serviceCenterService;

    @PostMapping("/{cateId}")
    ApiResponse<ServiceResponse> createService(@PathVariable String cateId, @RequestBody @Valid ServiceRequest serviceRequest) {

        return ApiResponse.<ServiceResponse>builder()
                .result(serviceCenterService.createService(serviceRequest, cateId))
                .build();
    }

    @GetMapping("/{cateId}")
    ApiResponse<List<ServiceResponse>> getAllServicesByCateId(@PathVariable String cateId) {

        return ApiResponse.<List<ServiceResponse>>builder()
                .result(serviceCenterService.getServicesByCategory(cateId))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<ServiceResponse> updateService(@PathVariable String id, @RequestBody @Valid ServiceRequest serviceRequest) {

        return ApiResponse.<ServiceResponse>builder()
                .result(serviceCenterService.updateService(id, serviceRequest))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<String> deleteServiceCategory(@PathVariable String id) {
        serviceCenterService.deleteService(id);
        return ApiResponse.<String>builder()
                .result("Service has been deleted")
                .build();
    }

}
