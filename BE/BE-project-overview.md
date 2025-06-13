# Pet Center Management System - Tổng quan dự án

## 1. Giới thiệu chung

**Pet Center Management System** là hệ thống quản lý trung tâm chăm sóc thú cưng được phát triển bằng Spring Boot. Hệ thống cung cấp giải pháp toàn diện cho việc quản lý khách hàng, thú cưng, dịch vụ, đặt lịch và thanh toán.

## 2. Kiến trúc hệ thống

### 2.1 Technology Stack
- **Backend Framework**: Spring Boot 3.x
- **Security**: Spring Security với JWT Authentication
- **Database**: MySQL/MariaDB
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven
- **Authentication**: JWT Token với Refresh Token

### 2.2 Kiến trúc phần mềm
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controller    │───▶│    Service      │───▶│   Repository    │
│     Layer       │    │     Layer       │    │     Layer       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DTO/Request   │    │   Entity/       │    │    Database     │
│   Response      │    │   Mapper        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 3. Cơ sở dữ liệu

### 3.1 Sơ đồ ERD
```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │───────│  Customer   │───────│    Pet      │
│             │  1:1  │             │  1:N  │             │
└─────────────┘       └─────────────┘       └─────────────┘
       │                       │                     │
       │ 1:1                   │ 1:N                 │ 1:N
       ▼                       ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Staff    │       │   Booking   │       │BookingDetails│
│             │       │             │       │             │
└─────────────┘       └─────────────┘       └─────────────┘
       │                       │                     │
       │ 1:N                   │ 1:1                 │ N:1
       └───────────────────────┼─────────────────────┘
                               ▼
                     ┌─────────────┐
                     │   Payment   │
                     │             │
                     └─────────────┘

┌─────────────┐       ┌─────────────┐
│ServiceCategory│─────│  Services   │
│             │  1:N  │             │
└─────────────┘       └─────────────┘
                             │
                             │ 1:N
                             ▼
                     ┌─────────────┐
                     │BookingDetails│
                     │             │
                     └─────────────┘
```

### 3.2 Các bảng chính

#### Bảng User
- **Mục đích**: Quản lý tài khoản đăng nhập
- **Các trường chính**: userId, username, password, role
- **Mối quan hệ**: 1:1 với Customer hoặc Staff

#### Bảng Customer  
- **Mục đích**: Thông tin chi tiết khách hàng
- **Các trường chính**: customerId, name, address, phone, email, dob
- **Mối quan hệ**: 1:N với Pet, 1:N với Booking

#### Bảng Staff
- **Mục đích**: Thông tin nhân viên
- **Các trường chính**: staffId, name, phone, email, address
- **Mối quan hệ**: 1:N với BookingDetails

#### Bảng Pet
- **Mục đích**: Thông tin thú cưng
- **Các trường chính**: petId, name, species, age, weight, gender, color
- **Mối quan hệ**: N:1 với Customer, 1:N với BookingDetails

#### Bảng ServiceCategory
- **Mục đích**: Danh mục dịch vụ
- **Các trường chính**: cateId, name, description
- **Mối quan hệ**: 1:N với Services

#### Bảng Services
- **Mục đích**: Chi tiết dịch vụ
- **Các trường chính**: serviceId, name, description, min_price, max_price, duration
- **Mối quan hệ**: N:1 với ServiceCategory, 1:N với BookingDetails

#### Bảng Booking
- **Mục đích**: Đơn đặt lịch tổng thể
- **Các trường chính**: bookingId, status, note, createdDate, bookingDate, bookingTime, total, rating, comment
- **Mối quan hệ**: N:1 với Customer, 1:N với BookingDetails, 1:1 với Payment

#### Bảng BookingDetails
- **Mục đích**: Chi tiết từng dịch vụ trong đơn đặt lịch
- **Các trường chính**: bookingDetailsId, status, priority, selectedDate, selectedTime, price
- **Mối quan hệ**: N:1 với Booking, Pet, Services, Staff

#### Bảng Payment
- **Mục đích**: Thông tin thanh toán
- **Các trường chính**: paymentId, method, invoiceNumber, subtotal, discount, tax, total
- **Mối quan hệ**: 1:1 với Booking

## 4. Nghiệp vụ chính

### 4.1 Quy trình đăng ký và quản lý tài khoản

#### 4.1.1 Đăng ký Customer
1. User gửi thông tin đăng ký (username, password, thông tin cá nhân)
2. Hệ thống tạo User với role=CUSTOMER
3. Tạo Customer profile liên kết với User
4. Trả về thông tin tài khoản đã tạo

#### 4.1.2 Đăng ký Staff
1. Admin tạo tài khoản Staff
2. Hệ thống tạo User với role=STAFF  
3. Tạo Staff profile liên kết với User
4. Staff có thể đăng nhập và xử lý booking

#### 4.1.3 Authentication Flow
1. **Login**: POST /auth/token với username/password → JWT token
2. **Token Verification**: POST /auth/introspect → kiểm tra token hợp lệ
3. **Token Refresh**: POST /auth/refresh → làm mới token
4. **Logout**: POST /auth/logout → vô hiệu hóa token

### 4.2 Quy trình quản lý thú cưng

#### 4.2.1 Thêm thú cưng
1. Customer đăng nhập vào hệ thống
2. Tạo profile thú cưng với thông tin: tên, loài, tuổi, cân nặng, giới tính, màu lông
3. Thú cưng được liên kết với Customer

#### 4.2.2 Quản lý thú cưng
- Xem danh sách thú cưng của mình
- Cập nhật thông tin thú cưng
- Xóa thú cưng (nếu không có booking nào đang active)

### 4.3 Quy trình quản lý dịch vụ

#### 4.3.1 Tạo danh mục dịch vụ
1. Admin tạo ServiceCategory (VD: Grooming, Health Check, Training)
2. Mỗi category có name và description

#### 4.3.2 Tạo dịch vụ chi tiết
1. Admin tạo Services thuộc một ServiceCategory
2. Thông tin dịch vụ: tên, mô tả, giá min/max, thời gian thực hiện
3. Customer có thể xem và chọn dịch vụ

### 4.4 Quy trình đặt lịch (Booking Flow)

#### 4.4.1 Tạo booking mới
1. **Customer chọn dịch vụ**: 
   - Xem danh sách ServiceCategory
   - Chọn Services cụ thể trong category
   - Xem thông tin giá và thời gian

2. **Tạo booking order**:
   ```json
   {
     "customerId": "uuid",
     "bookingDate": "2024-01-15",
     "bookingTime": "09:00:00",
     "note": "Ghi chú đặc biệt",
     "bookingDetails": [
       {
         "petId": "pet-uuid",
         "serviceId": "service-uuid",
         "selectedDate": "2024-01-15",
         "selectedTime": "09:00:00"
       }
     ]
   }
   ```

3. **Hệ thống xử lý**:
   - Tạo Booking với status = "Pending"
   - Tạo BookingDetails cho từng dịch vụ với status = "Blocked"
   - Tính tổng tiền dự kiến

#### 4.4.2 Quản lý booking
1. **Xác nhận booking**: Admin/Staff chuyển status từ "Pending" → "Confirmed"
2. **Phân công nhân viên**: Gán Staff cho từng BookingDetails
3. **Sắp xếp lịch trình**: Cập nhật priority và thời gian cụ thể cho từng dịch vụ

#### 4.4.3 Thực hiện dịch vụ
1. **Bắt đầu**: Staff chuyển BookingDetails status từ "Pending" → "InProgress"
2. **Hoàn thành**: Staff chuyển status → "Completed"
3. **Cập nhật giá**: Staff nhập giá thực tế cho dịch vụ
4. **Hoàn thành booking**: Khi tất cả BookingDetails = "Completed", Booking → "Completed"

#### 4.4.4 Đánh giá dịch vụ
1. Customer có thể đánh giá (rating 1-5) và comment
2. Thông tin này lưu trong Booking

### 4.5 Quy trình thanh toán

#### 4.5.1 Tạo hóa đơn thanh toán
1. Sau khi Booking hoàn thành, tạo Payment
2. Tính toán:
   - **Subtotal**: Tổng tiền các dịch vụ
   - **Discount**: Giảm giá (nếu có)
   - **Tax**: Thuế
   - **Total**: Tổng cuối cùng

#### 4.5.2 Phương thức thanh toán
- **Cash**: Tiền mặt tại quầy
- **Transfer**: Chuyển khoản ngân hàng
- **VnPay**: Ví điện tử VnPay
- **Momo**: Ví điện tử Momo

#### 4.5.3 Theo dõi thanh toán
- Tạo Payment record với invoiceNumber
- Cập nhật Booking status = "Paid" khi thanh toán thành công

## 5. Phân quyền và bảo mật

### 5.1 Phân quyền theo Role

#### ADMIN
- Quản lý tất cả User, Customer, Staff
- Quản lý ServiceCategory và Services
- Xem tất cả Booking và Payment
- Thống kê và báo cáo

#### STAFF  
- Xem và cập nhật thông tin cá nhân
- Xem BookingDetails được phân công
- Cập nhật trạng thái và giá dịch vụ
- Xem thông tin Customer và Pet liên quan

#### CUSTOMER
- Quản lý thông tin cá nhân và Pet
- Tạo và theo dõi Booking
- Xem lịch sử và thanh toán
- Đánh giá dịch vụ

### 5.2 Bảo mật
- **JWT Authentication**: Xác thực bằng token
- **Password Encryption**: Mã hóa mật khẩu
- **Role-based Authorization**: Phân quyền theo vai trò
- **API Security**: Bảo vệ các endpoint nhạy cảm

## 6. Tính năng nâng cao

### 6.1 Quản lý lịch trình
- **Priority System**: Sắp xếp thứ tự ưu tiên cho BookingDetails
- **Time Slot Management**: Quản lý khung giờ làm việc
- **Staff Assignment**: Phân công nhân viên tự động hoặc thủ công

### 6.2 Báo cáo và thống kê
- Doanh thu theo thời gian
- Thống kê dịch vụ phổ biến
- Hiệu suất nhân viên
- Đánh giá khách hàng

### 6.3 Tích hợp thanh toán
- Hỗ trợ nhiều phương thức thanh toán
- Tích hợp với VnPay, Momo
- Quản lý hóa đơn và thuế

## 7. Khả năng mở rộng

### 7.1 Tính năng có thể phát triển
- **Notification System**: Thông báo qua email/SMS
- **Mobile App**: Ứng dụng di động cho Customer
- **Inventory Management**: Quản lý kho thuốc/vật tư
- **Medical Records**: Hồ sơ y tế thú cưng
- **Appointment Reminders**: Nhắc nhở lịch hên
- **Multi-location**: Quản lý nhiều chi nhánh

### 7.2 Tích hợp API
- **Payment Gateways**: Tích hợp cổng thanh toán
- **SMS/Email Services**: Dịch vụ gửi tin nhắn
- **Calendar Integration**: Tích hợp lịch Google/Outlook
- **Social Media**: Chia sẻ lên mạng xã hội

## 8. Kết luận

Pet Center Management System là một giải pháp toàn diện cho việc quản lý trung tâm chăm sóc thú cưng, với kiến trúc rõ ràng, nghiệp vụ logic và khả năng mở rộng cao. Hệ thống đảm bảo trải nghiệm tốt cho cả khách hàng và nhân viên, đồng thời cung cấp công cụ quản lý hiệu quả cho admin.
