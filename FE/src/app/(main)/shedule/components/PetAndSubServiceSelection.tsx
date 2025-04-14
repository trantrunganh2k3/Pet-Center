import { useState } from 'react';
import { Pet, ServiceCategory, SubService } from '../types';

interface PetAndSubServiceSelectionProps {
  pets: Pet[];
  selectedCategory: ServiceCategory | null;
  selectedPet: Pet | null;
  selectedSubServices: SubService[];
  onPetSelect: (pet: Pet) => void;
  onSubServicesSelect: (services: SubService[]) => void;
  onNext: () => void;
  onBack: () => void;
}

// Mock data cho dịch vụ con (sẽ được thay thế bằng API call sau)
const mockSubServices: SubService[] = [
  {
    id: '1',
    name: 'Tắm thường',
    description: 'Dịch vụ tắm cơ bản cho thú cưng',
    categoryId: '1',
    price: 200000,
  },
  {
    id: '2',
    name: 'Tắm cao cấp',
    description: 'Dịch vụ tắm cao cấp với sản phẩm đặc biệt',
    categoryId: '1',
    price: 350000,
  },
  {
    id: '3',
    name: 'Cắt tỉa lông',
    description: 'Dịch vụ cắt tỉa lông theo yêu cầu',
    categoryId: '1',
    price: 250000,
  },
];

const PetAndSubServiceSelection: React.FC<PetAndSubServiceSelectionProps> = ({
  pets,
  selectedCategory,
  selectedPet,
  selectedSubServices,
  onPetSelect,
  onSubServicesSelect,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState<string | null>(null);

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
    const isSelected = selectedSubServices.some(s => s.id === service.id);
    if (isSelected) {
      onSubServicesSelect(selectedSubServices.filter(s => s.id !== service.id));
    } else {
      onSubServicesSelect([...selectedSubServices, service]);
    }
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
                  key={pet.id}
                  onClick={() => onPetSelect(pet)}
                  className={`p-4 rounded-lg cursor-pointer transition duration-200
                    ${selectedPet?.id === pet.id
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
            </div>
          </div>

          {/* Panel chọn dịch vụ con */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Chọn dịch vụ chi tiết</h3>
            <div className="grid gap-4">
              {mockSubServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleSubServiceToggle(service)}
                  className={`p-4 rounded-lg cursor-pointer transition duration-200
                    ${selectedSubServices.some(s => s.id === service.id)
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
                      {service.price.toLocaleString()}đ
                    </p>
                  </div>
                </div>
              ))}
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
    </div>
  );
};

export default PetAndSubServiceSelection;
