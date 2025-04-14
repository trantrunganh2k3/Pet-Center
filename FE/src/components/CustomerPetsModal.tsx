import React from 'react';
import { Pet } from '../types/interfaces';
import LoadingSkeleton from './LoadingSkeleton';

interface CustomerPetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  pets: Pet[] | undefined;
  loading?: boolean;
}

const CustomerPetsModal: React.FC<CustomerPetsModalProps> = ({
  isOpen,
  onClose,
  customerName,
  pets,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Thú cưng của {customerName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="px-6 py-4">
          {loading ? (
            <LoadingSkeleton rows={3} />
          ) : pets && pets.length > 0 ? (
            <div className="space-y-4">
              {pets.map((pet) => (
                <div
                  key={pet.petId}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {pet.name}
                      </h4>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Giống loài:</span> {pet.species}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Tuổi:</span> {pet.age} tuổi
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Cân nặng:</span> {pet.weight} kg
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Giới tính:</span>{' '}
                          {pet.gender === 'MALE' ? 'Đực' : 'Cái'}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Màu sắc:</span> {pet.color}
                        </p>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-800 font-medium">
                        {pet.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Khách hàng này chưa có thú cưng nào
            </div>
          )}
        </div>
        <div className="px-6 py-4 bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPetsModal;
