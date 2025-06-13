# Pet Center Management System - API Documentation

## 1. Tổng quan API

### 1.1 Base URL
```
http://localhost:8080
```

### 1.2 Authentication
Hệ thống sử dụng JWT Token Authentication. Hầu hết các API cần header Authorization:
```
Authorization: Bearer <JWT_TOKEN>
```

### 1.3 Response Format
Tất cả API response theo format chuẩn:
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    // Dữ liệu response
  }
}
```

## 2. Authentication APIs

### 2.1 Đăng nhập
**Endpoint**: `POST /auth/token`

**Mô tả**: Xác thực người dùng và trả về JWT token

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_string",
    "authenticated": true
  }
}
```

**Chức năng**:
- Xác thực username/password
- Tạo JWT token với thời hạn
- Tạo refresh token để làm mới
- Trả về thông tin xác thực

### 2.2 Kiểm tra token
**Endpoint**: `POST /auth/introspect`

**Mô tả**: Kiểm tra tính hợp lệ của JWT token

**Request Body**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:
```json
{
  "code": 1000,
  "message": "Success", 
  "result": {
    "valid": true
  }
}
```

### 2.3 Làm mới token
**Endpoint**: `POST /auth/refresh`

**Mô tả**: Làm mới JWT token bằng refresh token

**Request Body**:
```json
{
  "token": "refresh_token_string"
}
```

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token",
    "authenticated": true
  }
}
```

### 2.4 Đăng xuất
**Endpoint**: `POST /auth/logout`

**Mô tả**: Vô hiệu hóa token hiện tại

**Request Body**:
```json
{
  "token": "current_jwt_token"
}
```

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": null
}
```

## 3. User Management APIs

### 3.1 Tạo user mới (Admin only)
**Endpoint**: `POST /users`

**Mô tả**: Tạo tài khoản user mới (chỉ admin)

**Request Body**:
```json
{
  "username": "string",
  "password": "string",
  "role": "ADMIN|STAFF|CUSTOMER"
}
```

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "userId": "uuid",
    "username": "string",
    "role": "string"
  }
}
```

### 3.2 Đăng ký khách hàng
**Endpoint**: `POST /users/register`

**Mô tả**: Đăng ký tài khoản khách hàng mới

**Request Body**:
```json
{
  "username": "string",
  "password": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "dob": "YYYY-MM-DD"
}
```

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "userId": "uuid",
    "username": "string",
    "role": "CUSTOMER"
  }
}
```

**Chức năng**:
- Tạo User với role = CUSTOMER
- Tạo Customer profile liên kết
- Validate thông tin đầu vào
- Mã hóa password

### 3.3 Đăng ký nhân viên
**Endpoint**: `POST /users/staff-register`

**Mô tả**: Đăng ký tài khoản nhân viên (Admin only)

**Request Body**: Tương tự `/users/register`

**Chức năng**:
- Tạo User với role = STAFF
- Tạo Staff profile liên kết

### 3.4 Lấy thông tin user
**Endpoint**: `GET /users/{userID}`

**Mô tả**: Lấy thông tin chi tiết user theo ID

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "userId": "uuid",
    "username": "string",
    "role": "string"
  }
}
```

### 3.5 Lấy thông tin user hiện tại
**Endpoint**: `GET /users/myInfo`

**Mô tả**: Lấy thông tin user đang đăng nhập

**Headers**: `Authorization: Bearer <token>`

### 3.6 Cập nhật user
**Endpoint**: `PUT /users/{userID}`

**Request Body**:
```json
{
  "password": "new_password"
}
```

### 3.7 Xóa user
**Endpoint**: `DELETE /users/{userID}`

**Mô tả**: Xóa user (Admin only)

## 4. Customer Management APIs

### 4.1 Tạo customer profile
**Endpoint**: `POST /customers/{userID}`

**Mô tả**: Tạo thông tin chi tiết cho customer

**Request Body**:
```json
{
  "name": "string",
  "address": "string", 
  "phone": "string",
  "email": "string",
  "dob": "YYYY-MM-DD"
}
```

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "customerId": "uuid",
    "user": {
      "userId": "uuid",
      "username": "string"
    },
    "name": "string",
    "address": "string",
    "phone": "string", 
    "email": "string",
    "dob": "YYYY-MM-DD"
  }
}
```

### 4.2 Lấy thông tin customer
**Endpoint**: `GET /customers/{userID}`

**Mô tả**: Lấy thông tin customer theo user ID

### 4.3 Lấy thông tin customer hiện tại
**Endpoint**: `GET /customers/myInfo`

**Mô tả**: Customer lấy thông tin của chính mình

### 4.4 Lấy tất cả customers
**Endpoint**: `GET /customers`

**Mô tả**: Lấy danh sách tất cả customers (Admin/Staff only)

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": [
    {
      "customerId": "uuid",
      "name": "string",
      "email": "string",
      "phone": "string"
    }
  ]
}
```

### 4.5 Cập nhật customer
**Endpoint**: `PUT /customers/{userID}`

**Request Body**: Tương tự POST

### 4.6 Xóa customer
**Endpoint**: `DELETE /customers/{userID}`

## 5. Staff Management APIs

### 5.1 Tạo staff
**Endpoint**: `POST /staffs/{userID}`

**Request Body**:
```json
{
  "name": "string",
  "phone": "string",
  "email": "string", 
  "address": "string"
}
```

### 5.2 Lấy thông tin staff
**Endpoint**: `GET /staffs/{userID}`

### 5.3 Lấy thông tin staff hiện tại
**Endpoint**: `GET /staffs/myInfo`

### 5.4 Lấy tất cả staffs
**Endpoint**: `GET /staffs`

### 5.5 Cập nhật staff
**Endpoint**: `PUT /staffs/{userID}`

### 5.6 Xóa staff
**Endpoint**: `DELETE /staffs/{userID}`

## 6. Pet Management APIs

### 6.1 Tạo thú cưng
**Endpoint**: `POST /pets/{customerID}`

**Mô tả**: Thêm thú cưng mới cho customer

**Request Body**:
```json
{
  "name": "string",
  "species": "string",
  "age": 0,
  "weight": 0.0,
  "gender": "string",
  "color": "string"
}
```

**Response**:
```json
{
  "code": 1000,
  "message": "Success", 
  "result": {
    "petId": "uuid",
    "name": "string",
    "species": "string",
    "age": 0,
    "weight": 0.0,
    "gender": "string", 
    "color": "string",
    "customer": {
      "customerId": "uuid",
      "name": "string"
    }
  }
}
```

**Chức năng**:
- Tạo pet profile mới
- Liên kết với customer
- Validate thông tin pet

### 6.2 Lấy thông tin pet
**Endpoint**: `GET /pets/{petId}`

**Mô tả**: Lấy chi tiết thú cưng theo ID

### 6.3 Lấy tất cả pets
**Endpoint**: `GET /pets`

**Mô tả**: Lấy danh sách tất cả pets (Admin/Staff only)

### 6.4 Lấy pets của customer
**Endpoint**: `GET /pets/customer/{customerID}`

**Mô tả**: Lấy danh sách thú cưng của một customer

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": [
    {
      "petId": "uuid",
      "name": "string",
      "species": "string",
      "age": 0
    }
  ]
}
```

### 6.5 Cập nhật pet
**Endpoint**: `PUT /pets/{petID}`

**Request Body**: Tương tự POST

### 6.6 Xóa pet
**Endpoint**: `DELETE /pets/{petID}`

**Mô tả**: Xóa thú cưng (chỉ khi không có booking active)

## 7. Service Category APIs

### 7.1 Tạo danh mục dịch vụ
**Endpoint**: `POST /service_category`

**Mô tả**: Tạo danh mục dịch vụ mới (Admin only)

**Request Body**:
```json
{
  "name": "string",
  "description": "string"
}
```

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "cateId": "uuid",
    "name": "string", 
    "description": "string"
  }
}
```

**Chức năng**:
- Tạo danh mục dịch vụ
- Validate tên danh mục unique
- Chỉ admin được tạo

### 7.2 Lấy tất cả danh mục
**Endpoint**: `GET /service_category`

**Mô tả**: Lấy danh sách tất cả danh mục dịch vụ

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": [
    {
      "cateId": "uuid",
      "name": "Grooming",
      "description": "Dịch vụ chăm sóc lông"
    },
    {
      "cateId": "uuid", 
      "name": "Health Check",
      "description": "Khám sức khỏe tổng quát"
    }
  ]
}
```

### 7.3 Cập nhật danh mục
**Endpoint**: `PUT /service_category/{id}`

### 7.4 Xóa danh mục
**Endpoint**: `DELETE /service_category/{id}`

## 8. Service Detail APIs

### 8.1 Tạo dịch vụ
**Endpoint**: `POST /service_detail/{cateId}`

**Mô tả**: Thêm dịch vụ mới vào danh mục

**Request Body**:
```json
{
  "name": "string",
  "description": "string",
  "min_price": 100000,
  "max_price": 500000,
  "duration": 60
}
```

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "serviceId": "uuid",
    "name": "string",
    "description": "string", 
    "min_price": 100000,
    "max_price": 500000,
    "duration": 60,
    "category": {
      "cateId": "uuid",
      "name": "string"
    }
  }
}
```

**Chức năng**:
- Tạo dịch vụ thuộc danh mục
- Định giá min/max
- Thời gian thực hiện (phút)

### 8.2 Lấy dịch vụ theo danh mục
**Endpoint**: `GET /service_detail/{cateId}`

**Mô tả**: Lấy tất cả dịch vụ trong một danh mục

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": [
    {
      "serviceId": "uuid",
      "name": "Cắt tỉa lông",
      "description": "Dịch vụ cắt tỉa lông chuyên nghiệp",
      "min_price": 150000,
      "max_price": 300000,
      "duration": 45
    }
  ]
}
```

### 8.3 Cập nhật dịch vụ
**Endpoint**: `PUT /service_detail/{id}`

### 8.4 Xóa dịch vụ
**Endpoint**: `DELETE /service_detail/{id}`

## 9. Booking Management APIs

### 9.1 Tạo booking
**Endpoint**: `POST /bookings`

**Mô tả**: Tạo đơn đặt lịch mới

**Request Body**:
```json
{
  "customerId": "uuid",
  "bookingDate": "2024-01-15",
  "bookingTime": "09:00:00",
  "note": "Ghi chú đặc biệt",
  "bookingDetails": [
    {
      "petId": "uuid",
      "serviceId": "uuid", 
      "selectedDate": "2024-01-15",
      "selectedTime": "09:00:00"
    },
    {
      "petId": "uuid",
      "serviceId": "uuid",
      "selectedDate": "2024-01-15", 
      "selectedTime": "10:30:00"
    }
  ]
}
```

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "bookingId": "uuid",
    "status": "Pending",
    "note": "string",
    "createdDate": "2024-01-15",
    "bookingDate": "2024-01-15",
    "bookingTime": "09:00:00",
    "total": 500000,
    "customer": {
      "customerId": "uuid",
      "name": "string"
    },
    "bookingDetails": [
      {
        "bookingDetailsId": "uuid",
        "status": "Blocked",
        "priority": 1,
        "selectedDate": "2024-01-15",
        "selectedTime": "09:00:00",
        "price": 250000,
        "pet": {
          "petId": "uuid",
          "name": "string"
        },
        "service": {
          "serviceId": "uuid", 
          "name": "string"
        }
      }
    ]
  }
}
```

**Chức năng**:
- Tạo booking tổng thể
- Tạo booking details cho từng dịch vụ
- Tính toán tổng tiền dự kiến
- Status mặc định: Pending
- BookingDetails status: Blocked

### 9.2 Lấy tất cả bookings
**Endpoint**: `GET /bookings`

**Mô tả**: Lấy danh sách tất cả bookings (Admin/Staff only)

### 9.3 Lấy booking theo ID
**Endpoint**: `GET /bookings/info/{bookingId}`

**Mô tả**: Lấy chi tiết booking

### 9.4 Lấy bookings của customer
**Endpoint**: `GET /bookings/{userId}`

**Mô tả**: Customer xem danh sách booking của mình

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": [
    {
      "bookingId": "uuid",
      "status": "Confirmed",
      "bookingDate": "2024-01-15",
      "bookingTime": "09:00:00", 
      "total": 500000,
      "rating": 5,
      "comment": "Dịch vụ tốt"
    }
  ]
}
```

### 9.5 Cập nhật booking
**Endpoint**: `PUT /bookings/{bookingId}`

**Mô tả**: Cập nhật thông tin booking

**Request Body**:
```json
{
  "status": "Confirmed|InProgress|Completed|Canceled",
  "note": "string",
  "bookingDate": "2024-01-15",
  "bookingTime": "09:00:00"
}
```

**Chức năng**:
- Admin/Staff cập nhật status
- Thay đổi ngày/giờ booking
- Cập nhật ghi chú

### 9.6 Đánh giá booking
**Endpoint**: `PUT /bookings/evaluate/{bookingId}`

**Mô tả**: Customer đánh giá sau khi hoàn thành

**Request Body**:
```json
{
  "rating": 5,
  "comment": "Dịch vụ rất tốt, nhân viên thân thiện"
}
```

**Chức năng**:
- Customer đánh giá rating 1-5
- Để lại comment
- Chỉ được đánh giá khi status = Completed

## 10. Booking Details APIs

### 10.1 Lấy chi tiết booking
**Endpoint**: `GET /booking_details/{bookingId}`

**Mô tả**: Lấy tất cả booking details của một booking

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": [
    {
      "bookingDetailsId": "uuid",
      "status": "InProgress",
      "priority": 1,
      "selectedDate": "2024-01-15",
      "selectedTime": "09:00:00",
      "price": 250000,
      "booking": {
        "bookingId": "uuid"
      },
      "pet": {
        "petId": "uuid",
        "name": "Mèo Mỡ"
      },
      "service": {
        "serviceId": "uuid",
        "name": "Cắt tỉa lông"
      },
      "staff": {
        "staffId": "uuid",
        "name": "Nguyễn Văn A"
      }
    }
  ]
}
```

### 10.2 Lấy booking details của staff
**Endpoint**: `GET /booking_details/staff/{staffId}`

**Mô tả**: Staff xem các booking details được phân công

**Response**: Danh sách booking details được giao cho staff

### 10.3 Cập nhật trạng thái
**Endpoint**: `PUT /booking_details/status/{bookingId}`

**Mô tả**: Cập nhật trạng thái booking details

**Request Body**:
```json
"Blocked|Pending|InProgress|Completed"
```

**Chức năng**:
- Staff cập nhật tiến độ
- Blocked → Pending → InProgress → Completed
- Tự động cập nhật booking status khi tất cả details completed

### 10.4 Phân công nhân viên
**Endpoint**: `PUT /booking_details/arrange/{bookingId}`

**Mô tả**: Phân công staff cho booking details

**Request Body**:
```json
[
  {
    "bookingDetailsId": "uuid",
    "staffId": "uuid",
    "priority": 1,
    "selectedDate": "2024-01-15",
    "selectedTime": "09:00:00"
  },
  {
    "bookingDetailsId": "uuid", 
    "staffId": "uuid",
    "priority": 2,
    "selectedDate": "2024-01-15",
    "selectedTime": "10:30:00"
  }
]
```

**Chức năng**:
- Admin/Staff phân công nhân viên
- Sắp xếp thứ tự ưu tiên
- Điều chỉnh thời gian thực hiện

### 10.5 Cập nhật giá dịch vụ
**Endpoint**: `PUT /booking_details/price/{bookingId}`

**Mô tả**: Cập nhật giá thực tế cho từng dịch vụ

**Request Body**:
```json
[
  {
    "bookingDetailsId": "uuid",
    "price": 300000
  },
  {
    "bookingDetailsId": "uuid",
    "price": 250000  
  }
]
```

**Chức năng**:
- Staff nhập giá thực tế sau khi thực hiện
- Tự động tính lại tổng tiền booking
- Cập nhật để chuẩn bị thanh toán

## 11. Payment APIs

### 11.1 Tạo thanh toán
**Endpoint**: `POST /payment`

**Mô tả**: Tạo hóa đơn thanh toán cho booking

**Request Body**:
```json
{
  "bookingId": "uuid",
  "method": "Cash|Transfer|VnPay|Momo",
  "invoiceNumber": "INV-2024-001",
  "note": "Thanh toán đầy đủ",
  "subtotal": 500000,
  "discount": 50000,
  "tax": 25000,
  "total": 475000
}
```

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "paymentId": "uuid",
    "method": "Cash",
    "invoiceNumber": "INV-2024-001",
    "note": "string",
    "subtotal": 500000,
    "discount": 50000, 
    "tax": 25000,
    "total": 475000,
    "booking": {
      "bookingId": "uuid",
      "status": "Paid"
    }
  }
}
```

**Chức năng**:
- Tạo hóa đơn thanh toán
- Hỗ trợ nhiều phương thức
- Tính toán thuế và giảm giá
- Cập nhật booking status = Paid

### 11.2 Lấy payment theo ID
**Endpoint**: `GET /payment/payment/{paymentId}`

**Mô tả**: Lấy thông tin thanh toán theo payment ID

### 11.3 Lấy payment theo booking
**Endpoint**: `GET /payment/booking/{bookingId}`

**Mô tả**: Lấy thông tin thanh toán của một booking

**Response**:
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "paymentId": "uuid",
    "method": "VnPay",
    "invoiceNumber": "INV-2024-001",
    "subtotal": 500000,
    "discount": 50000,
    "tax": 25000, 
    "total": 475000,
    "booking": {
      "bookingId": "uuid",
      "customer": {
        "name": "Nguyễn Văn A"
      }
    }
  }
}
```

## 12. Quy trình nghiệp vụ chi tiết

### 12.1 Quy trình đặt lịch hoàn chỉnh

#### Bước 1: Customer chuẩn bị
```
1. POST /users/register → Tạo tài khoản
2. POST /auth/token → Đăng nhập
3. POST /pets/{customerId} → Thêm thú cưng
```

#### Bước 2: Xem dịch vụ và đặt lịch
```
1. GET /service_category → Xem danh mục dịch vụ
2. GET /service_detail/{cateId} → Xem dịch vụ trong danh mục
3. POST /bookings → Tạo booking
```

#### Bước 3: Admin/Staff xử lý
```
1. GET /bookings → Xem booking mới
2. PUT /bookings/{bookingId} → Xác nhận (status = Confirmed)
3. PUT /booking_details/arrange/{bookingId} → Phân công staff
```

#### Bước 4: Staff thực hiện
```
1. GET /booking_details/staff/{staffId} → Xem công việc được giao
2. PUT /booking_details/status/{bookingId} → Cập nhật tiến độ
3. PUT /booking_details/price/{bookingId} → Nhập giá thực tế
```

#### Bước 5: Thanh toán và hoàn thành
```
1. POST /payment → Tạo hóa đơn thanh toán
2. PUT /bookings/evaluate/{bookingId} → Customer đánh giá
```

### 12.2 Các case đặc biệt

#### Hủy booking
```
PUT /bookings/{bookingId}
{
  "status": "Canceled",
  "note": "Lý do hủy"
}
```

#### Thay đổi lịch
```
PUT /bookings/{bookingId}
{
  "bookingDate": "new_date",
  "bookingTime": "new_time"
}
```

#### Phân công lại staff
```
PUT /booking_details/arrange/{bookingId}
[
  {
    "bookingDetailsId": "uuid",
    "staffId": "new_staff_id"
  }
]
```

## 13. Error Codes

### 13.1 Authentication Errors
- `1001`: Unauthenticated
- `1002`: Unauthorized
- `1003`: Invalid token

### 13.2 Validation Errors  
- `1004`: Invalid input
- `1005`: User existed
- `1006`: User not found

### 13.3 Business Logic Errors
- `1007`: Booking not found
- `1008`: Pet not found
- `1009`: Service not available
- `1010`: Invalid booking status

## 14. Lưu ý quan trọng

### 14.1 Bảo mật
- Tất cả API (trừ register/login) cần JWT token
- Phân quyền theo role: ADMIN > STAFF > CUSTOMER
- Customer chỉ thao tác với dữ liệu của mình

### 14.2 Validation
- Email format chuẩn
- Phone number format 
- Date format: YYYY-MM-DD
- Time format: HH:mm:ss

### 14.3 Business Rules
- Không thể xóa Customer/Pet có booking active
- Booking chỉ được đánh giá khi status = Completed
- BookingDetails phải có Staff trước khi InProgress
- Payment chỉ tạo khi booking Completed

### 14.4 Data Relationships
- User 1:1 Customer/Staff
- Customer 1:N Pet, 1:N Booking
- Booking 1:N BookingDetails, 1:1 Payment
- ServiceCategory 1:N Services
- BookingDetails N:1 Pet, Service, Staff, Booking

Hệ thống API này cung cấp đầy đủ chức năng cho việc quản lý trung tâm chăm sóc thú cưng từ đăng ký, đặt lịch, thực hiện dịch vụ đến thanh toán và đánh giá.
