import { useState } from 'react';

interface DateTimeSelectionProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

// Mock data cho các khung giờ có sẵn
const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!selectedDate) {
      setError('Vui lòng chọn ngày');
      return;
    }
    if (!selectedTime) {
      setError('Vui lòng chọn giờ');
      return;
    }
    setError(null);
    onNext();
  };

  // Tạo mảng các ngày cho 2 tuần tới
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      // Chỉ thêm các ngày từ thứ 2 đến thứ 7 (0 = CN, 1-6 = T2-T7)
      if (date.getDay() !== 0) {
        dates.push(date);
      }
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  const formatDate = (date: Date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`;
  };

  const isDateEqual = (date1: Date, date2: Date | null) => {
    if (!date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-8">
        {/* Date Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Chọn ngày</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {availableDates.map((date, index) => (
              <div
                key={index}
                onClick={() => onDateSelect(date)}
                className={`p-3 rounded-lg text-center cursor-pointer transition duration-200
                  ${isDateEqual(date, selectedDate)
                    ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                  }`}
              >
                <div className="font-medium">{formatDate(date)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Chọn giờ</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {timeSlots.map((time) => (
              <div
                key={time}
                onClick={() => onTimeSelect(time)}
                className={`p-3 rounded-lg text-center cursor-pointer transition duration-200
                  ${time === selectedTime
                    ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                  }`}
              >
                {time}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
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
    </div>
  );
};

export default DateTimeSelection;
