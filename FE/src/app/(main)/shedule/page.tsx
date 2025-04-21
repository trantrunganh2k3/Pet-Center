'use client';

import { useState } from 'react';
import { ServiceCategory, Pet, SubService, Schedule } from './types';
import StepIndicator from '@/app/(main)/shedule/components/StepIndicator';
import ServiceCategorySelection from '@/app/(main)/shedule/components/ServiceCategorySelection';
import PetAndSubServiceSelection from '@/app/(main)/shedule/components/PetAndSubServiceSelection';
import DateTimeSelection from '@/app/(main)/shedule/components/DateTimeSelection';
import ScheduleConfirmation from '@/app/(main)/shedule/components/ScheduleConfirmation';
import { useServiceCategory } from '@/data/ServiceCategoryData';
import { useCustomerPets } from './hooks/useCustomerPets';
import { useSubServices } from './hooks/useSubServices';
import Cookies from 'js-cookie';

export default function SchedulePage() {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedSubServices, setSelectedSubServices] = useState<SubService[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const customerId: string = Cookies.get('customerId') || ''; // Lấy customerId từ cookie (hoặc auth context)

  // Custom hooks
  const { serviceCategories, loading: loadingCategories, error: errorCategories } = useServiceCategory();
  const { pets, loading: loadingPets, createPet } = useCustomerPets();
  
  const handleAddPet = async (petData: Omit<Pet, 'petId'>) => {
    const newPet = await createPet(petData);
    if (newPet) {
      setSelectedPet(newPet); // Tự động chọn pet mới thêm
    }
  };
  const { subServices, loading: loadingServices } = useSubServices(selectedCategory?.cateId || null);

  // Handlers
  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category);
    handleNext();
  };

  const handleScheduleSubmit = () => {
    const scheduleData: Schedule = {
      customerId: customerId, // Sẽ lấy từ context hoặc auth state
      petId: selectedPet!.petId,
      subServiceIds: selectedSubServices.map(service => service.serviceId),
      date: selectedDate!,
      time: selectedTime!,
      createdAt: new Date()
    };
    
    // Sẽ được implement sau
    console.log('Schedule submitted:', scheduleData);
  };

  // Kiểm tra điều kiện để hiển thị bước cuối
  const canShowConfirmation = selectedCategory && selectedPet && selectedSubServices.length > 0 && selectedDate && selectedTime;
  
  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceCategorySelection
            categories={serviceCategories}
            loading={loadingCategories}
            error={errorCategories}
            onSelect={handleCategorySelect}
          />
        );
      case 2: {
        if (!selectedCategory) {
          return (
            <div className="text-center text-red-500">
              Vui lòng chọn dịch vụ trước
            </div>
          );
        }
        return (
          <PetAndSubServiceSelection
            pets={pets}
            subServices={subServices}
            selectedCategory={selectedCategory}
            onPetSelect={setSelectedPet}
            onSubServicesSelect={setSelectedSubServices}
            selectedPet={selectedPet}
            selectedSubServices={selectedSubServices}
            onNext={handleNext}
            onBack={handleBack}
            loading={loadingPets || loadingServices}
            onAddPet={handleAddPet}
          />
        );
      }
      case 3:
        return (
          <DateTimeSelection
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return canShowConfirmation ? (
          <ScheduleConfirmation
            category={selectedCategory}
            pet={selectedPet}
            subServices={selectedSubServices}
            date={selectedDate}
            time={selectedTime}
            onSubmit={handleScheduleSubmit}
            onBack={handleBack}
          />
        ) : (
          <div className="text-center text-red-500">
            Vui lòng hoàn thành các bước trước
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Đặt lịch dịch vụ</h1>
      
      <StepIndicator currentStep={currentStep} totalSteps={4} />
      
      <div className="mt-8">
        {renderStep()}
      </div>
    </div>
  );
}
