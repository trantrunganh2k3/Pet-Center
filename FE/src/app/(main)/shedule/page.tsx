'use client';

import { useState, useEffect } from 'react';
import { serviceCategoryAPI } from '@/app/APIRoute';
import axios from 'axios';
import { APIResponse, ServiceCategory, Pet, SubService } from './types';
import StepIndicator from '@/app/(main)/shedule/components/StepIndicator';
import ServiceCategorySelection from '@/app/(main)/shedule/components/ServiceCategorySelection';
import PetAndSubServiceSelection from '@/app/(main)/shedule/components/PetAndSubServiceSelection';
import DateTimeSelection from '@/app/(main)/shedule/components/DateTimeSelection';
import ScheduleConfirmation from '@/app/(main)/shedule/components/ScheduleConfirmation';
import Cookies from 'js-cookie';

// Mock data cho thú cưng (sẽ được thay thế bằng API call)
const mockPets = [
  { id: 1, name: 'Lucky', type: 'Chó', breed: 'Corgi', image: '/images/dog.jpg' },
  { id: 2, name: 'Milo', type: 'Mèo', breed: 'Scottish Fold', image: '/images/cute-dog.jpg' },
];

export default function SchedulePage() {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedSubServices, setSelectedSubServices] = useState<SubService[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Fetch service categories
  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        const response = await axios.get<APIResponse<ServiceCategory[]>>(
          serviceCategoryAPI,
          {
            headers: {
              'Authorization': `Bearer ${Cookies.get('accessToken')}`,
            },
            validateStatus: function (status) {
              return true; // Always return response instead of exception
            },
          },);
        if (response.data.code === 1000) {
          setServiceCategories(response.data.result);
        } else {
          setError('Không thể tải danh sách dịch vụ');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceCategories();
  }, []);

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
    // Sẽ được implement sau
    console.log('Schedule submitted:', {
      category: selectedCategory,
      pet: selectedPet,
      subServices: selectedSubServices,
      date: selectedDate,
      time: selectedTime,
    });
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
            loading={loading}
            error={error}
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
            pets={mockPets}
            selectedCategory={selectedCategory}
            onPetSelect={setSelectedPet}
            onSubServicesSelect={setSelectedSubServices}
            selectedPet={selectedPet}
            selectedSubServices={selectedSubServices}
            onNext={handleNext}
            onBack={handleBack}
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
