package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.CustomerRequest;
import com.example.BE.dto.request.StaffRequest;
import com.example.BE.dto.response.CustomerResponse;
import com.example.BE.dto.response.StaffResponse;
import com.example.BE.repository.CustomerRepository;
import com.example.BE.repository.StaffRepository;
import com.example.BE.service.CustomerService;
import com.example.BE.service.StaffService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/staffs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StaffController {

    StaffRepository staffRepository;
    StaffService staffService;

    @PostMapping("/{userID}")
    ApiResponse<StaffResponse> createStaff(@RequestBody @Valid StaffRequest request, @PathVariable("userID") String userId) {

        return ApiResponse.<StaffResponse>builder()
                .result(staffService.createStaff(request, userId))
                .build();
    }

    @GetMapping("/{userID}")
    ApiResponse<StaffResponse> getStaff(@PathVariable("userID") String userID) {

        return ApiResponse.<StaffResponse>builder()
                .result(staffService.getStaff(userID))
                .build();
    }

    @GetMapping("/myInfo")
    ApiResponse<StaffResponse> getMyInfo() {

        return ApiResponse.<StaffResponse>builder()
                .result(staffService.getMyInfo())
                .build();
    }

    @GetMapping
    ApiResponse<List<StaffResponse>> getAllStaff() {

        return ApiResponse.<List<StaffResponse>>builder()
                .result(staffService.getAllStaffs())
                .build();
    }

    @PutMapping("/{userID}")
    ApiResponse<StaffResponse> updateStaff(@PathVariable("userID") String userID, @RequestBody @Valid StaffRequest request) {
        ApiResponse<StaffResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(staffService.updateStaff(request, userID));
        return apiResponse;
    }

    @DeleteMapping("/{userID}")
    String deleteStaff(@PathVariable("userID") String userID) {
        staffService.deleteStaff(userID);
        return "User deleted";
    }
}
