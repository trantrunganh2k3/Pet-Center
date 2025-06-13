package com.example.BE.controller;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.example.BE.dto.request.ApiResponse;
import com.example.BE.dto.request.PetRequest;
import com.example.BE.dto.response.PetResponse;
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
@Tag(name = "Pet Management", description = "Pet information management")
public class PetController {

    PetService petService;

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

    @GetMapping("/customer/{customerID}")
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
    ApiResponse<String> deletePet(@PathVariable("petID") String petID) {
        petService.deletePet(petID);
        return ApiResponse.<String>builder()
                .result("Pet has been deleted")
                .build();
    }
}
