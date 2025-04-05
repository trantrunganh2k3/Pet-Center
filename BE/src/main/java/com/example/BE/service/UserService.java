package com.example.BE.service;

import com.example.BE.dto.request.CustomerRegistrationRequest;
import com.example.BE.dto.request.UserCreationRequest;
import com.example.BE.dto.request.UserUpdateRequest;
import com.example.BE.dto.response.UserResponse;
import com.example.BE.entity.Customer;
import com.example.BE.entity.Staff;
import com.example.BE.entity.User;
import com.example.BE.exception.AppException;
import com.example.BE.exception.ErrorCode;
import com.example.BE.mapper.UserMapper;
import com.example.BE.repository.CustomerRepository;
import com.example.BE.repository.StaffRepository;
import com.example.BE.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class UserService {
    final UserRepository userRepository;
    final UserMapper userMapper;
    final PasswordEncoder passwordEncoder;
    final CustomerRepository customerRepository;
    final StaffRepository staffRepository;

    public UserResponse createRequest(UserCreationRequest request) {

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        try {
            user = userRepository.save(user);
        }catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse registerCustomer(CustomerRegistrationRequest request) {
        // Tạo User
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        // Lưu User để có userId
        try {
            user = userRepository.save(user);
        }catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        user = userRepository.save(user);

        // Tạo Customer và thiết lập mối quan hệ
        Customer customer = new Customer();
        customer.setUser(user);
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
        if(request.getDob() != null) {
            customer.setDob(request.getDob());
        }

        // Lưu Customer
        customerRepository.save(customer);

        // Tạo và trả về response
        return userMapper.toUserResponse(user);
    }

    public UserResponse registerStaff(CustomerRegistrationRequest request) {
        // Tạo User
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        // Lưu User để có userId
        try {
            user = userRepository.save(user);
        }catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        user = userRepository.save(user);

        // Tạo Customer và thiết lập mối quan hệ
        Staff staff = new Staff();
        staff.setUser(user);
        staff.setName(request.getName());
        staff.setPhone(request.getPhone());
        staff.setEmail(request.getEmail());
        staff.setAddress(request.getAddress());

        staffRepository.save(staff);

        // Tạo và trả về response
        return userMapper.toUserResponse(user);
    }

    public UserResponse getUser(String id) {
        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    public UserResponse getMyInfo(){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toUserResponse(user);
    }

    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        userMapper.updateUser(user, request);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
