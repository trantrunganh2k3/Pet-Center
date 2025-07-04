package com.example.BE.mapper;

import com.example.BE.dto.request.ServiceCategoryRequest;
import com.example.BE.dto.response.ServiceCategoryResponse;
import com.example.BE.entity.ServiceCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ServiceCategoryMapper {

    ServiceCategoryResponse toServiceCategoryResponse(ServiceCategory serviceCategory);

    @Mapping(target = "cateId", ignore = true)
    @Mapping(target = "services", ignore = true)
    ServiceCategory toServiceCategory(ServiceCategoryRequest request);

    @Mapping(target = "cateId", ignore = true)
    @Mapping(target = "services", ignore = true)
    void updateServiceCategory(ServiceCategoryRequest request, @MappingTarget ServiceCategory serviceCategory);
}
