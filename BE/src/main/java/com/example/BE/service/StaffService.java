package com.example.BE.service;

import com.example.BE.dto.request.StaffRequest;
import com.example.BE.dto.response.StaffResponse;
import com.example.BE.entity.Staff;
import com.example.BE.entity.User;
import com.example.BE.exception.AppException;
import com.example.BE.exception.ErrorCode;
import com.example.BE.mapper.StaffMapper;
import com.example.BE.repository.StaffRepository;
import com.example.BE.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class StaffService {

    final StaffRepository staffRepository;
    final UserRepository userRepository;
    final StaffMapper staffMapper;

    public StaffResponse createStaff(StaffRequest request, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Staff staff = staffMapper.toStaff(request);
        staff.setUser(user);
        try {
            staff = staffRepository.save(staff);
        }catch (DataIntegrityViolationException e){
            throw new AppException(ErrorCode.STAFF_EXISTED);
        }

        return staffMapper.toStaffResponse(staff);
    }

    public List<StaffResponse> getAllStaffs() {

        return staffRepository.findAll().stream().map(staffMapper::toStaffResponse).toList();
    }

    public StaffResponse getStaff(String customerId) {
        return staffMapper.toStaffResponse(staffRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND)));
    }

    public StaffResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));

        Staff staff = user.getStaff();
        return staffMapper.toStaffResponse(staff);
    }

    public StaffResponse updateStaff(StaffRequest request, String userId) {

        Staff staff = staffRepository.findByStaffId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));

        staffMapper.updateStaff(staff, request);
        return staffMapper.toStaffResponse(staffRepository.save(staff));
    }

    public void deleteStaff(String customerId) {
        staffRepository.deleteById(customerId);
        userRepository.deleteById(customerId);
    }
}
