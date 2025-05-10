'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { bookingAPI, serviceCategoryAPI, serviceAPI, petAPI, subServiceAPI } from '@/app/APIRoute';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking');
  const isEditMode = Boolean(bookingId);

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedSubServices, setSelectedSubServices] = useState<SubService[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const router = useRouter();

  const customerId: string = Cookies.get('userId') || ''; // Lấy customerId từ cookie (hoặc auth context)

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

  // Load booking data when in edit mode
  useEffect(() => {
    if (bookingId) {
      const loadBookingData = async () => {
        try {
          // Fetch booking details
          const [bookingResponse, detailsResponse] = await Promise.all([
            fetch(`${bookingAPI}/${bookingId}`, {
              credentials: 'include'
            }),
            fetch(`${subServiceAPI}/${bookingId}`, {
              credentials: 'include'
            })
          ]);

          if (!bookingResponse.ok || !detailsResponse.ok) {
            throw new Error('Failed to fetch booking data');
          }

          const bookingData = await bookingResponse.json();
          const bookingDetails = await detailsResponse.json();

          // Set selected category from the first service's category
          const firstService = bookingDetails[0];
          const categoryResponse = await fetch(`${serviceCategoryAPI}/${firstService.categoryId}`, {
            credentials: 'include'
          });
          if (categoryResponse.ok) {
            const category = await categoryResponse.json();
            setSelectedCategory(category);
          }

          // Set selected pet
          const petResponse = await fetch(`${petAPI}/${bookingData.petId}`, {
            credentials: 'include'
          });
          if (petResponse.ok) {
            const pet = await petResponse.json();
            setSelectedPet(pet);
          }

          // Set selected services
          const servicesPromises = bookingDetails.map((detail: { serviceId: string }) => 
            fetch(`${serviceAPI}/${detail.serviceId}`, {
              credentials: 'include'
            }).then(res => res.json())
          );
          const services = await Promise.all(servicesPromises);
          setSelectedSubServices(services);

          // Set date and time
          const bookingDate = new Date(bookingData.bookingDate);
          setSelectedDate(bookingDate);
          setSelectedTime(bookingData.bookingDate.split('T')[1].substring(0, 5));

          setCurrentStep(4); // Move to confirmation step
        } catch (error) {
          toast.error('Không thể tải thông tin đặt lịch');
          router.push('/my-account/history');
        } finally {
          setIsLoading(false);
        }
      };

      loadBookingData();
    }
  }, [bookingId]);

  const handleScheduleSubmit = async () => {
    // Format dates to match backend expectations
    const formattedSelectedDate = selectedDate ? 
      `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}` 
      : null;

    // Format time to include seconds (HH:mm:ss)
    const formattedTime = selectedTime ? `${selectedTime}:00` : null;

    const formattedCreatedDate = new Date().toISOString().split('T')[0];

    const bookingData = {
      customerId: customerId,
      petId: selectedPet!.petId,
      servicesId: selectedSubServices.map(service => service.serviceId),
      selectedDate: formattedSelectedDate,
      selectedTime: formattedTime,
      createdDate: formattedCreatedDate
    };

    // Debug log to verify data format
    console.log('Booking data being sent:', {
      ...bookingData,
      selectedTime_original: selectedTime,
      selectedTime_formatted: formattedTime
    });

    // Kiểm tra dữ liệu lịch hẹn trước khi gửi
    console.log('Booking Data:', bookingData);
    console.log('Token:', Cookies.get('accessToken'));
    if (!bookingData.customerId || !bookingData.petId || !bookingData.servicesId.length || !bookingData.selectedDate || !bookingData.selectedTime) {
      toast.error('Vui lòng điền đầy đủ thông tin lịch hẹn!');
      return;
    }

    // Gọi API để lưu hoặc cập nhật lịch hẹn
    const method = isEditMode ? 'put' : 'post';
    const url = isEditMode ? `${bookingAPI}/${bookingId}` : bookingAPI;

    const response = await axios[method]<{ code: number; result: any }>(
      url, 
      bookingData, 
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('accessToken')}` // Lấy accessToken từ cookie
        },

        validateStatus: function (status: number): boolean {
          return true; // Luôn trả về response thay vì exception
      },
    });

    // Kiểm tra code từ response data thay vì status
    const data = response.data;
    if (data.code !== 1000) {
      // Hiển thị thông báo lỗi từ server
      console.log(data);
      toast.error(data.result || 'Đặt lịch không thành công');
    }
    else {
      // Xử lý đặt lịch thành công
      toast.success(isEditMode ? "Cập nhật lịch thành công!" : "Đặt lịch thành công!");
      // Reset form hoặc chuyển hướng đến trang khác
      setCurrentStep(1);
      setSelectedCategory(null);
      setSelectedPet(null);
      setSelectedSubServices([]);
      setSelectedDate(null);
      setSelectedTime(null);
      router.push('/'); // Chuyển hướng về trang chính hoặc trang khác
    }

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
            isEditMode={isEditMode}
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {isEditMode ? 'Cập nhật lịch đặt' : 'Đặt lịch dịch vụ'}
      </h1>
      
      <StepIndicator currentStep={currentStep} totalSteps={4} />
      
      <div className="mt-8">
        {renderStep()}
      </div>
    </div>
  );
}
