package com.example.BE.mapper;

import com.example.BE.dto.request.CustomerRequest;
import com.example.BE.dto.request.StaffRequest;
import com.example.BE.dto.response.CustomerResponse;
import com.example.BE.dto.response.StaffResponse;
import com.example.BE.entity.Customer;
import com.example.BE.entity.Staff;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StaffMapper {

    @Mapping(target = "staffId", ignore = true)
    @Mapping(target = "user", ignore = true)
    Staff toStaff(StaffRequest staffRequest);

    @Mapping(target = "staffId", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateStaff(@MappingTarget Staff staff, StaffRequest staffRequest);

    StaffResponse toStaffResponse(Staff staff);
}
