package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.response.DashboardResponse;
import com.example.BE.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ApiResponse<DashboardResponse> getDashboard() {
        return ApiResponse.<DashboardResponse>builder()
                .result(dashboardService.getDashboardStats())
                .build();
    }
}

