package com.example.BE.mapper;

import com.example.BE.dto.request.ServiceRequest;
import com.example.BE.dto.response.ServiceResponse;
import com.example.BE.entity.Services;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ServiceMapper {

    @Mapping(target = "category", ignore = true)
    Services toService(ServiceRequest serviceRequest);

    @Mapping(target = "category", ignore = true)
    void updateService(@MappingTarget Services services, ServiceRequest serviceRequest);

    ServiceResponse toServiceResponse(Services services);
}
