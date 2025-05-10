import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface DateTimeSelectionProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  // Reset showTimeModal when selectedDate changes
  useEffect(() => {
    if (!selectedDate) {
      setShowTimeModal(false);
    }
  }, [selectedDate]);

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

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    // Get last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week for the first day (0-6)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days: Array<{ date: Date; isCurrentMonth: boolean; isSelectable: boolean }> = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false,
        isSelectable: false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const today = new Date();
      const isSelectable = date > today && date.getDay() !== 0; // Not Sunday and not in the past
      
      days.push({
        date,
        isCurrentMonth: true,
        isSelectable
      });
    }
    
    // Add days from next month if needed
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // 6 rows × 7 days = 42
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isSelectable: false
      });
    }
    
    return days;
  };

  const handleDateClick = (date: Date, isSelectable: boolean) => {
    if (!isSelectable) return;
    
    setTempDate(date);
    setShowTimeModal(true);
  };

  const handleTimeSelect = (time: string) => {
    if (tempDate) {
      onDateSelect(tempDate);
      onTimeSelect(time);
      setShowTimeModal(false);
    }
  };

  const changeMonth = (delta: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const formatMonthYear = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-3xl mx-auto relative">
      <div className="space-y-8">
        {/* Calendar View */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">
              {formatMonthYear(currentMonth)}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
              <div key={day} className="text-center font-medium py-2 text-gray-600">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {getCalendarDays().map((day, index) => {
              const isSelected = selectedDate && 
                day.date.toDateString() === selectedDate.toDateString();

              const isToday = new Date().toDateString() === day.date.toDateString();

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(day.date, day.isSelectable)}
                  className={`
                    aspect-square flex items-center justify-center relative
                    ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${day.isSelectable ? 'cursor-pointer hover:bg-blue-50' : 'cursor-not-allowed opacity-50'}
                    ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                    ${isToday && !isSelected ? 'border-2 border-blue-500' : ''}
                    rounded-full transition-all duration-200
                  `}
                >
                  {day.date.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Selection Modal */}
        {showTimeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
              <h3 className="text-lg font-semibold text-center">
                Chọn giờ cho ngày {tempDate?.toLocaleDateString('vi-VN')}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`
                      p-2 rounded-md text-center transition-colors
                      ${time === selectedTime 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowTimeModal(false)}
                className="w-full p-2 bg-gray-100 hover:bg-gray-200 rounded-md mt-4 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {/* Selected DateTime Display */}
        {(selectedDate || selectedTime) && (
          <div className="text-center text-gray-600">
            Đã chọn: {selectedDate?.toLocaleDateString('vi-VN')} 
            {selectedTime && ` - ${selectedTime}`}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
          >
            Quay lại
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelection;
