import { useState } from 'react';
import { Pet } from '../types';

interface QuickAddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (petData: Omit<Pet, 'petId'>) => Promise<void>;
  loading: boolean;
}

const QuickAddPetModal: React.FC<QuickAddPetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Chó');
  const [species, setSpecies] = useState('');
  const [age, setAge] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        name,
        type,
        species,
        age,
        weight,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to add pet:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setType('Chó');
    setSpecies('');
    setAge(0);
    setWeight(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Thêm thú cưng mới</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên thú cưng
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Chó">Chó</option>
                <option value="Mèo">Mèo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giống loài
              </label>
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tuổi
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cân nặng (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded-md
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            >
              {loading ? 'Đang xử lý...' : 'Thêm thú cưng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddPetModal;
