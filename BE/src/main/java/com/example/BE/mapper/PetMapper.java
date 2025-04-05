package com.example.BE.mapper;

import com.example.BE.dto.request.PetRequest;
import com.example.BE.dto.response.PetResponse;
import com.example.BE.entity.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PetMapper {

    @Mapping(target = "customer", ignore = true)
    Pet toPet(PetRequest petRequest);

    @Mapping(target = "customer", ignore = true)
    void updatePet(@MappingTarget Pet pet, PetRequest petRequest);

    PetResponse toPetResponse(Pet pet);
}
