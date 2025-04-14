import React from 'react';
import { Staff, Shift } from '../types/interfaces';
import LoadingSkeleton from './LoadingSkeleton';

interface StaffScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff;
  loading?: boolean;
}

const DAYS_OF_WEEK = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
const SHIFTS = [
  { start: '08:00', end: '10:00' },
  { start: '10:00', end: '12:00' },
  { start: '13:00', end: '15:00' },
  { start: '15:00', end: '17:00' },
  { start: '17:00', end: '19:00' },
];

// Mock data - sẽ thay thế bằng dữ liệu thật sau
const getMockSchedule = () => {
  const schedule = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const shifts = SHIFTS.map(shift => ({
      startTime: shift.start,
      endTime: shift.end,
      status: Math.random() > 0.7 ? 'BOOKED' : Math.random() > 0.5 ? 'OFF' : 'AVAILABLE',
      service: Math.random() > 0.7 ? 'Cắt tỉa lông' : undefined,
      customer: Math.random() > 0.7 ? 'Nguyễn Văn A' : undefined,
    } as Shift));

    schedule.push({
      date: date.toISOString().split('T')[0],
      shifts,
    });
  }
  return schedule;
};

const StaffScheduleModal: React.FC<StaffScheduleModalProps> = ({
  isOpen,
  onClose,
  staff,
  loading = false,
}) => {
  if (!isOpen) return null;

  const mockSchedule = getMockSchedule();

  const getShiftStatusColor = (status: Shift['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'BOOKED':
        return 'bg-blue-100 text-blue-800';
      case 'OFF':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getShiftStatusText = (status: Shift['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Trống';
      case 'BOOKED':
        return 'Đã đặt';
      case 'OFF':
        return 'Nghỉ';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Lịch làm việc của {staff.name}
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
        
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <LoadingSkeleton rows={5} />
          ) : (
            <div className="grid grid-cols-7 gap-4">
              {DAYS_OF_WEEK.map((day, index) => (
                <div key={day} className="space-y-4">
                  <div className="text-center font-medium py-2 bg-gray-50 rounded">
                    <div>{day}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(mockSchedule[index].date).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {mockSchedule[index].shifts.map((shift, shiftIndex) => (
                      <div
                        key={shiftIndex}
                        className={`p-2 rounded ${getShiftStatusColor(shift.status)}`}
                      >
                        <div className="text-sm font-medium">
                          {shift.startTime} - {shift.endTime}
                        </div>
                        <div className="text-xs">
                          {getShiftStatusText(shift.status)}
                        </div>
                        {shift.service && (
                          <div className="text-xs mt-1">
                            <span className="font-medium">Dịch vụ:</span> {shift.service}
                          </div>
                        )}
                        {shift.customer && (
                          <div className="text-xs">
                            <span className="font-medium">Khách:</span> {shift.customer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Trống</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Đã đặt</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Nghỉ</span>
            </div>
          </div>
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

export default StaffScheduleModal;
