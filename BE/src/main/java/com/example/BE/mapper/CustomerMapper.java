package com.example.BE.mapper;

import com.example.BE.dto.request.CustomerRequest;
import com.example.BE.dto.request.UserCreationRequest;
import com.example.BE.dto.request.UserUpdateRequest;
import com.example.BE.dto.response.CustomerResponse;
import com.example.BE.dto.response.UserResponse;
import com.example.BE.entity.Customer;
import com.example.BE.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    @Mapping(target = "customerId", ignore = true)
    @Mapping(target = "user", ignore = true)
    Customer toCustomer(CustomerRequest customerRequest);

    @Mapping(target = "customerId", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateCustomer(@MappingTarget Customer customer, CustomerRequest customerRequest);

    CustomerResponse toCustomerResponse(Customer customer);
}
