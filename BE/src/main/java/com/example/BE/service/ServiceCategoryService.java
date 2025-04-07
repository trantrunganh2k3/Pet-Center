package com.example.BE.service;

import com.example.BE.dto.request.ServiceCategoryRequest;
import com.example.BE.dto.response.ServiceCategoryResponse;
import com.example.BE.entity.ServiceCategory;
import com.example.BE.exception.AppException;
import com.example.BE.exception.ErrorCode;
import com.example.BE.mapper.ServiceCategoryMapper;
import com.example.BE.repository.ServiceCategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class ServiceCategoryService {

    final ServiceCategoryRepository serviceCategoryRepository;
    final ServiceCategoryMapper serviceCategoryMapper;

    public ServiceCategoryResponse create(ServiceCategoryRequest serviceCategoryRequest) {

        ServiceCategory serviceCategory = serviceCategoryMapper.toServiceCategory(serviceCategoryRequest);

        return serviceCategoryMapper.toServiceCategoryResponse(serviceCategoryRepository.save(serviceCategory));

    }

    public List<ServiceCategoryResponse> getAll() {
        return serviceCategoryRepository.findAll().stream()
                .map(serviceCategoryMapper::toServiceCategoryResponse).toList();
    }

    public ServiceCategoryResponse update(ServiceCategoryRequest serviceCategoryRequest, String id) {

        ServiceCategory serviceCategory = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_CATEGORY_NOT_FOUND));

        serviceCategoryMapper.updateServiceCategory(serviceCategoryRequest, serviceCategory);
        return serviceCategoryMapper.toServiceCategoryResponse(serviceCategoryRepository.save(serviceCategory));
    }


}
