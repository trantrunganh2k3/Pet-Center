package com.example.BE.service;

import com.example.BE.dto.request.ServiceRequest;
import com.example.BE.dto.response.ServiceResponse;
import com.example.BE.entity.ServiceCategory;
import com.example.BE.entity.Services;
import com.example.BE.exception.AppException;
import com.example.BE.exception.ErrorCode;
import com.example.BE.mapper.ServiceMapper;
import com.example.BE.repository.ServiceCategoryRepository;
import com.example.BE.repository.ServiceRepository;
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
public class ServiceCenterService {

    final ServiceRepository serviceRepository;
    final ServiceMapper serviceMapper;
    final ServiceCategoryRepository serviceCategoryRepository;

    public ServiceResponse createService(ServiceRequest serviceRequest, String id) {

        ServiceCategory serviceCategory = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_CATEGORY_NOT_FOUND));

        Services service = serviceMapper.toService(serviceRequest);
        service.setCategory(serviceCategory);
        return serviceMapper.toServiceResponse(serviceRepository.save(service));
    }

    public List<ServiceResponse> getServicesByCategory(String id) {

        return serviceRepository.findByCategoryCateId(id)
                .stream().map(serviceMapper::toServiceResponse).toList();
    }

    public ServiceResponse updateService(String id, ServiceRequest serviceRequest) {

        Services service = serviceRepository.findById(id)
                        .orElseThrow();

        serviceMapper.updateService(service, serviceRequest);
        return serviceMapper.toServiceResponse(serviceRepository.save(service));
    }

    public void deleteService(String id) {
        serviceRepository.deleteById(id);
    }

}
