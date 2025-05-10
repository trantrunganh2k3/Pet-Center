import { Button } from 'antd';
import { BookingStatus } from '@/app/types/booking';

interface StatusUpdateButtonsProps {
  onUpdate: (status: BookingStatus) => Promise<void>;
}

export function StatusUpdateButtons({ onUpdate }: StatusUpdateButtonsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button block type="primary" onClick={() => onUpdate('CONFIRMED')}>
        Xác nhận
      </Button>
      <Button block onClick={() => onUpdate('COMPLETED')}>
        Hoàn thành
      </Button>
      <Button block danger onClick={() => onUpdate('CANCELLED')}>
        Hủy
      </Button>
    </div>
  );
}
