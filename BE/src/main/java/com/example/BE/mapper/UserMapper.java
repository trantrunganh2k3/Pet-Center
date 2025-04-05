package com.example.BE.mapper;

import com.example.BE.dto.request.UserCreationRequest;
import com.example.BE.dto.request.UserUpdateRequest;
import com.example.BE.dto.response.UserResponse;
import org.mapstruct.Mapper;
import com.example.BE.entity.User;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {CustomerMapper.class, StaffMapper.class})
public interface UserMapper {

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "staff", ignore = true)
    User toUser(UserCreationRequest user);


    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "staff", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);

    UserResponse toUserResponse(User user);
}
