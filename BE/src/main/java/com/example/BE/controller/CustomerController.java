package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.CustomerRequest;
import com.example.BE.dto.request.UserCreationRequest;
import com.example.BE.dto.request.UserUpdateRequest;
import com.example.BE.dto.response.CustomerResponse;
import com.example.BE.dto.response.UserResponse;
import com.example.BE.repository.CustomerRepository;
import com.example.BE.repository.UserRepository;
import com.example.BE.service.CustomerService;
import com.example.BE.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerController {

    CustomerService customerService;
    CustomerRepository customerRepository;

    @PostMapping("/{userID}")
    ApiResponse<CustomerResponse> createUCustomer(@RequestBody @Valid CustomerRequest request, @PathVariable("userID") String userId) {

        return ApiResponse.<CustomerResponse>builder()
                .result(customerService.createCustomer(request, userId))
                .build();
    }

    @GetMapping("/{userID}")
    ApiResponse<CustomerResponse> getCustomer(@PathVariable("userID") String userID) {

        return ApiResponse.<CustomerResponse>builder()
                .result(customerService.getCustomer(userID))
                .build();
    }

    @GetMapping("/myInfo")
    ApiResponse<CustomerResponse> getMyInfo() {

        return ApiResponse.<CustomerResponse>builder()
                .result(customerService.getMyInfo())
                .build();
    }

    @GetMapping
    ApiResponse<List<CustomerResponse>> getAllCustomers() {

        return ApiResponse.<List<CustomerResponse>>builder()
                .result(customerService.getAllCustomers())
                .build();
    }

    @PutMapping("/{userID}")
    ApiResponse<CustomerResponse> updateCustomer(@PathVariable("userID") String userID, @RequestBody @Valid CustomerRequest request) {
        ApiResponse<CustomerResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(customerService.updateCustomer(request, userID));
        return apiResponse;
    }

    @DeleteMapping("/{userID}")
    String deleteUser(@PathVariable("userID") String userID) {
        customerService.deleteCustomer(userID);
        return "User deleted";
    }
}
