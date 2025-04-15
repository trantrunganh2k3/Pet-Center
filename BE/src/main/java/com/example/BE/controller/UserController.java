package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.CustomerRegistrationRequest;
import com.example.BE.dto.request.UserCreationRequest;
import com.example.BE.dto.request.UserUpdateRequest;
import com.example.BE.dto.response.UserResponse;
import com.example.BE.entity.User;
import com.example.BE.repository.UserRepository;
import com.example.BE.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;
    private final UserRepository userRepository;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {

        return ApiResponse.<UserResponse>builder()
                .result(userService.createRequest(request))
                .build();
    }

    @PostMapping("/register")
    ApiResponse<UserResponse> createUserRegistration(@RequestBody CustomerRegistrationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.registerCustomer(request))
                .build();
    }

    @PostMapping("/staff-register")
    ApiResponse<UserResponse> createStaffRegistration(@RequestBody CustomerRegistrationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.registerStaff(request))
                .build();
    }

    @GetMapping("/{userID}")
    ApiResponse<UserResponse> getUser(@PathVariable("userID") String userID) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Username: {}", authentication.getName());
        if (authentication.getAuthorities().isEmpty()) {
            log.warn("Authorities is empty!");
        }
        log.info("Authentication class: {}", authentication.getClass().getName());

        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));

        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userID))
                .build();
    }

    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo() {

        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @PutMapping("/{userID}")
    ApiResponse<UserResponse> updateUser(@PathVariable("userID") String userID, @RequestBody @Valid UserUpdateRequest request) {
        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(userService.updateUser(userID, request));
        return apiResponse;
    }

    @DeleteMapping("/{userID}")
    ApiResponse<String> deleteUser(@PathVariable("userID") String userID) {
        userService.deleteUser(userID);
        return ApiResponse.<String>builder()
                .result("User has been deleted")
                .build();
    }
}
