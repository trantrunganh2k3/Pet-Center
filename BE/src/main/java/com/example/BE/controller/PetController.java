package com.example.BE.controller;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.CustomerRequest;
import com.example.BE.dto.request.PetRequest;
import com.example.BE.dto.response.CustomerResponse;
import com.example.BE.dto.response.PetResponse;
import com.example.BE.repository.CustomerRepository;
import com.example.BE.repository.PetRepository;
import com.example.BE.service.CustomerService;
import com.example.BE.service.PetService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/pets")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PetController {

    PetRepository petRepository;
    PetService petService;

    CustomerService customerService;
    CustomerRepository customerRepository;

    @PostMapping("/{customerID}")
    ApiResponse<PetResponse> createPet(@PathVariable String customerID, @RequestBody @Valid PetRequest petRequest) {

        return ApiResponse.<PetResponse>builder()
                .result(petService.createPet(petRequest, customerID))
                .build();
    }

    @GetMapping("/{petId}")
    ApiResponse<PetResponse> getPet(@PathVariable String petId) {

        return ApiResponse.<PetResponse>builder()
                .result(petService.getPet(petId))
                .build();
    }

    @GetMapping
    ApiResponse<List<PetResponse>> getAllPets() {

        return ApiResponse.<List<PetResponse>>builder()
                .result(petService.getAllPets())
                .build();
    }

    @GetMapping("/{customerID}")
    ApiResponse<List<PetResponse>> getPetsEachCus(@PathVariable("customerID") String customerID) {

        return ApiResponse.<List<PetResponse>>builder()
                .result(petService.getPetForEachCus(customerID))
                .build();
    }

    @PutMapping("/{petID}")
    ApiResponse<PetResponse> updatePet(@PathVariable String petID, @RequestBody @Valid PetRequest petRequest) {

        return ApiResponse.<PetResponse>builder()
                .result(petService.updatePet(petRequest, petID))
                .build();
    }

    @DeleteMapping("/{petID}")
    String deletePet(@PathVariable("petID") String petID) {
        petService.deletePet(petID);
        return "Pet deleted";
    }
}
