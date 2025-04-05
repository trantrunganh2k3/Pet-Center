package com.example.BE.service;

import com.example.BE.dto.request.CustomerRequest;
import com.example.BE.dto.response.CustomerResponse;
import com.example.BE.entity.Customer;
import com.example.BE.entity.User;
import com.example.BE.exception.AppException;
import com.example.BE.exception.ErrorCode;
import com.example.BE.mapper.CustomerMapper;
import com.example.BE.repository.CustomerRepository;
import com.example.BE.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class CustomerService {

    final UserRepository userRepository;
    final CustomerRepository customerRepository;
    final CustomerMapper customerMapper;

    public CustomerResponse createCustomer(CustomerRequest customerRequest, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Customer customer = customerMapper.toCustomer(customerRequest);
        customer.setUser(user);
        try {
            customer = customerRepository.save(customer);
        }catch (DataIntegrityViolationException e){
            throw new AppException(ErrorCode.CUSTOMER_EXISTED);
        }
        return customerMapper.toCustomerResponse(customer);
    }

    public List<CustomerResponse> getAllCustomers() {

        return customerRepository.findAll().stream().map(customerMapper::toCustomerResponse).toList();
    }

    public CustomerResponse getCustomer(String customerId) {
        return customerMapper.toCustomerResponse(customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_FOUND)));
    }

    public CustomerResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Customer customer = user.getCustomer();
        return customerMapper.toCustomerResponse(customer);
    }

    public CustomerResponse updateCustomer(CustomerRequest customerRequest, String userId) {
        Customer customer = customerRepository.findByCustomerId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        customerMapper.updateCustomer(customer, customerRequest);

        return customerMapper.toCustomerResponse(customerRepository.save(customer));
    }

    public void deleteCustomer(String customerId) {
        customerRepository.deleteById(customerId);
        userRepository.deleteById(customerId);
    }
}
