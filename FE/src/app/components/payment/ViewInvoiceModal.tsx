'use client';
import { Modal, Button, Spin } from 'antd';
import { Booking, BookingDetail } from '@/app/types/booking';
import html2pdf from 'html2pdf.js';
import InvoiceContent from './InvoiceContent';

interface ViewReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  details: BookingDetail[] | null;
}

const ViewReceiptModal = ({ isOpen, onClose, booking, details }: ViewReceiptModalProps) => {
  const handlePrint = () => {
  const element = document.getElementById('receipt');
  
  if (element) {
    // Hiển thị thông báo đang xử lý
    const loadingDiv = document.createElement('div');
    loadingDiv.innerText = 'Đang chuẩn bị hóa đơn...';
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.background = 'rgba(0,0,0,0.7)';
    loadingDiv.style.color = 'white';
    loadingDiv.style.padding = '15px';
    loadingDiv.style.borderRadius = '5px';
    loadingDiv.style.zIndex = '9999';
    document.body.appendChild(loadingDiv);
    
    // Sử dụng thư viện html2pdf.js
    import('html2pdf.js').then((html2pdf) => {
      const opt = {
        margin: 10,
        filename: `HoaDon_${booking?.bookingId || new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        }
      };
      
      // Tạo PDF và lưu nó như một Blob
      html2pdf.default()
        .from(element)
        .set(opt)
        .outputPdf('blob')
        .then((pdfBlob:any) => {
          // Xóa thông báo loading
          document.body.removeChild(loadingDiv);
          
          // Tạo URL cho Blob
          const blobUrl = URL.createObjectURL(pdfBlob);
          
          // Mở cửa sổ mới để hiển thị PDF
          const viewerWindow = window.open(blobUrl, '_blank');
          
          if (!viewerWindow) {
            // Nếu cửa sổ pop-up bị chặn, thông báo cho người dùng
            alert('Trình duyệt đã chặn cửa sổ pop-up. Vui lòng cho phép cửa sổ pop-up hoặc tải xuống PDF.');
            
            // Tạo liên kết tải xuống PDF như một giải pháp thay thế
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = `HoaDon_${booking?.bookingId || new Date().getTime()}.pdf`;
            downloadLink.click();
          }
          
          // Giải phóng bộ nhớ sau một khoảng thời gian
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 30000); // Đợi 30 giây trước khi giải phóng URL
        })
        .catch((err:unknown) => {
          console.error('Lỗi khi tạo PDF:', err);
          document.body.removeChild(loadingDiv);
          alert('Có lỗi xảy ra khi tạo hóa đơn PDF');
        });
    }).catch(err => {
      console.error('Lỗi khi tải thư viện html2pdf.js:', err);
      if (document.body.contains(loadingDiv)) {
        document.body.removeChild(loadingDiv);
      }
      alert('Không thể tải thư viện xử lý PDF. Vui lòng thử lại sau.');
    });
  }
};

  const handleExportPDF = () => {
    const element = document.getElementById('receipt');
    if (element) {
      import('html2pdf.js').then((html2pdf) => {
        html2pdf.default()
          .set({
            margin: 10,
            filename: `HoaDon_${booking?.bookingId}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          })
          .from(element)
          .save();
      });
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      title={`Hóa đơn #${booking?.bookingId}`}
    >
      {!booking || !details ? (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <InvoiceContent booking={booking} details={details} />
          <div className="text-center mt-4">
            <button
              onClick={handlePrint}
              className="px-4 py-1 border rounded hover:bg-gray-100"
            >
              In hóa đơn
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-1 border rounded hover:bg-gray-100"
            >
              Xuất PDF
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ViewReceiptModal;
