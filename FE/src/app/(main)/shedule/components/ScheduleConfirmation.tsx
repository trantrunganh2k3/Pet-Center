import { ServiceCategory, Pet, SubService } from '../types';

interface ScheduleConfirmationProps {
  category: ServiceCategory | null;
  pet: Pet | null;
  subServices: SubService[];
  date: Date | null;
  time: string | null;
  onSubmit: () => void;
  onBack: () => void;
}

const ScheduleConfirmation: React.FC<ScheduleConfirmationProps> = ({
  category,
  pet,
  subServices,
  date,
  time,
  onSubmit,
  onBack,
}) => {
  const formatDate = (date: Date) => {
    if (!date) return '';
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const totalPrice = subServices.reduce((sum, service) => 0, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Xác nhận thông tin đặt lịch
        </h2>

        {/* Thông tin dịch vụ */}
        <div className="space-y-6">
          {category && (
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Dịch vụ</h3>
              <p className="text-gray-600">{category.name}</p>
              <p className="text-sm text-gray-500 mt-1">{category.description}</p>
            </div>
          )}

          {/* Thông tin thú cưng */}
          {pet && (
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Thú cưng</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{pet.name}</p>
                  <p className="text-sm text-gray-600">
                    {pet.type} - {pet.breed}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Chi tiết dịch vụ */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Chi tiết dịch vụ</h3>
            <div className="space-y-2">
              {subServices.map((service) => (
                <div key={service.serviceId} className="flex justify-between">
                  <span className="text-gray-600">{service.name}</span>
                  <span className="text-gray-800 font-medium">
                    {service.min_price.toLocaleString()} - {service.max_price.toLocaleString()}đ
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between font-medium text-lg">
                  <span className="text-gray-800">Tổng cộng</span>
                  <span className="text-blue-600">{totalPrice.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thời gian */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Thời gian</h3>
            <p className="text-gray-600">
              {formatDate(date as Date)} - {time}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition"
          >
            Quay lại
          </button>
          <button
            onClick={onSubmit}
            className="px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Xác nhận đặt lịch
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleConfirmation;
