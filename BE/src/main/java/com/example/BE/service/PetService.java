package com.example.BE.service;

import com.example.BE.dto.request.CustomerRequest;
import com.example.BE.dto.request.PetRequest;
import com.example.BE.dto.response.CustomerResponse;
import com.example.BE.dto.response.PetResponse;
import com.example.BE.entity.Customer;
import com.example.BE.entity.Pet;
import com.example.BE.entity.User;
import com.example.BE.exception.AppException;
import com.example.BE.exception.ErrorCode;
import com.example.BE.mapper.CustomerMapper;
import com.example.BE.mapper.PetMapper;
import com.example.BE.repository.CustomerRepository;
import com.example.BE.repository.PetRepository;
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
public class PetService {

    final PetRepository petRepository;
    final PetMapper petMapper;


    final UserRepository userRepository;
    final CustomerRepository customerRepository;
    final CustomerMapper customerMapper;

    public PetResponse createPet(PetRequest petRequest, String customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_FOUND));

        Pet pet = petMapper.toPet(petRequest);
        pet.setCustomer(customer);
        petRepository.save(pet);

        return petMapper.toPetResponse(pet);
    }

    public List<PetResponse> getAllPets() {
        return petRepository.findAll().stream().map(petMapper::toPetResponse).toList();
    }

    public List<PetResponse> getPetForEachCus(String customerId) {
        return petRepository.findByCustomerCustomerId(customerId)
                .stream().map(petMapper::toPetResponse).toList();
    }

    public PetResponse getPet(String petId) {
        return petMapper.toPetResponse(petRepository.findById(petId)
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND)));
    }

    public PetResponse updatePet(PetRequest request, String petId) {

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new AppException(ErrorCode.PET_NOT_FOUND));

        petMapper.updatePet(pet, request);
        return petMapper.toPetResponse(petRepository.save(pet));

    }

    public void deletePet(String petId) {
        petRepository.deleteById(petId);
    }
}
