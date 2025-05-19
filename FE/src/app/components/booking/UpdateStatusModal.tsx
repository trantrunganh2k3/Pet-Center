import { Modal, Button } from 'antd';
import { BookingStatus } from '@/app/types/booking';

interface UpdateStatusModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (status: BookingStatus) => Promise<void>;
}

export function UpdateStatusModal({ open, onClose, onUpdate }: UpdateStatusModalProps) {
  return (
    <Modal
      title="Cập nhật trạng thái"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <div className="flex flex-col gap-2">
        <Button block type="primary" onClick={() => onUpdate('Confirmed')}>
          Xác nhận
        </Button>
        <Button block onClick={() => onUpdate('Completed')}>
          Hoàn thành
        </Button>
        <Button block danger onClick={() => onUpdate('Canceled')}>
          Hủy
        </Button>
      </div>
    </Modal>
  );
}
