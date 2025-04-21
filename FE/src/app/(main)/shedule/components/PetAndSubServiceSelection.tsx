import { useState } from 'react';
import { Pet, ServiceCategory, SubService } from '../types';
import QuickAddPetModal from './QuickAddPetModal';

interface PetAndSubServiceSelectionProps {
  pets: Pet[];
  subServices: SubService[];
  selectedCategory: ServiceCategory | null;
  selectedPet: Pet | null;
  selectedSubServices: SubService[];
  onPetSelect: (pet: Pet) => void;
  onSubServicesSelect: (services: SubService[]) => void;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
  onAddPet: (petData: Omit<Pet, 'petId'>) => Promise<void>;
}

const PetAndSubServiceSelection: React.FC<PetAndSubServiceSelectionProps> = ({
  pets,
  subServices,
  selectedCategory,
  selectedPet,
  selectedSubServices,
  onPetSelect,
  onSubServicesSelect,
  onNext,
  onBack,
  loading,
  onAddPet,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [showAddPetModal, setShowAddPetModal] = useState(false);

  const handleNext = () => {
    if (!selectedPet) {
      setError('Vui lòng chọn thú cưng');
      return;
    }
    if (selectedSubServices.length === 0) {
      setError('Vui lòng chọn ít nhất một dịch vụ');
      return;
    }
    setError(null);
    onNext();
  };

  const handleSubServiceToggle = (service: SubService) => {
    const isSelected = selectedSubServices.some(s => s.serviceId === service.serviceId);
    if (isSelected) {
      onSubServicesSelect(selectedSubServices.filter(s => s.serviceId !== service.serviceId));
    } else {
      onSubServicesSelect([...selectedSubServices, service]);
    }
  };

  const handleAddPet = async (petData: Omit<Pet, 'petId'>) => {
    await onAddPet(petData);
    setShowAddPetModal(false);
  };

  return (
    <div>
      {!selectedCategory && (
        <div className="text-center text-red-500">
          Vui lòng chọn dịch vụ trước
        </div>
      )}
      
      {selectedCategory && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Panel chọn thú cưng */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Chọn thú cưng</h3>
            <div className="grid gap-4">
              {pets.map((pet) => (
                <div
                  key={pet.petId}
                  onClick={() => onPetSelect(pet)}
                  className={`p-4 rounded-lg cursor-pointer transition duration-200
                    ${selectedPet?.petId === pet.petId
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{pet.name}</h4>
                      <p className="text-sm text-gray-600">
                        {pet.type} - {pet.breed}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Nút thêm thú cưng mới */}
              <button
                onClick={() => setShowAddPetModal(true)}
                className="p-4 rounded-lg border-2 border-dashed border-gray-300 
                         hover:border-blue-500 hover:text-blue-500 transition-colors
                         flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>{pets.length === 0 ? 'Thêm thú cưng đầu tiên' : 'Thêm thú cưng khác'}</span>
              </button>

              {pets.length === 0 && (
                <p className="text-center text-gray-500 mt-2">
                  Bạn chưa có thú cưng nào. Hãy thêm thú cưng để tiếp tục.
                </p>
              )}
            </div>
          </div>

          {/* Panel chọn dịch vụ con */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Chọn dịch vụ chi tiết</h3>
            <div className="grid gap-4">
              {subServices.map((service) => (
                <div
                  key={service.serviceId}
                  onClick={() => handleSubServiceToggle(service)}
                  className={`p-4 rounded-lg cursor-pointer transition duration-200
                    ${selectedSubServices.some(s => s.serviceId === service.serviceId)
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{service.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                    </div>
                    <p className="text-blue-600 font-medium">
                      {service.min_price.toLocaleString()} - {service.max_price.toLocaleString()}đ
                    </p>
                  </div>
                </div>
              ))}

              {subServices.length === 0 && (
                <p className="text-center text-gray-500">
                  Không có dịch vụ nào cho danh mục này
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition"
        >
          Quay lại
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Tiếp tục
        </button>
      </div>

      <QuickAddPetModal
        isOpen={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        onSubmit={handleAddPet}
        loading={loading}
      />
    </div>
  );
};

export default PetAndSubServiceSelection;
