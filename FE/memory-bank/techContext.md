# Ngữ cảnh kỹ thuật

## Công nghệ sử dụng

### Frontend Framework
- **Next.js v15.2.4**
  - App Router architecture
  - Server-side rendering (SSR)
  - API routes
  - TypeScript support
  - File-system based routing

### Language
- **TypeScript**
  - Strict mode
  - ESLint integration
  - Type checking
  - Interface definitions

### UI/Styling
- **Tailwind CSS v4**
  - Utility-first CSS framework
  - JIT (Just-In-Time) compilation
  - Custom configuration
  - Responsive design
  
### State Management & Data Fetching
- **React Hooks**
  - Custom hooks for data fetching
  - State management
  - Side effects handling

- **Axios v1.8.4**
  - HTTP client
  - Request/response interceptors
  - Error handling
  - API integration

### Authentication
- **JWT Authentication**
  - js-cookie v3.0.5 for cookie management
  - Token-based authentication
  - Session handling

### UI Components & Icons
- **Ant Design Icons v6.0.0**
  - Icon components
  - SVG based
  
- **Heroicons v2.2.0**
  - UI icons
  - React components

### Development Tools
- **ESLint v9**
  - Code quality
  - Style guide enforcement
  - TypeScript support

### Notifications
- **React Toastify v11.0.5**
  - Toast notifications
  - Custom styling
  - Queue management

## Cấu hình môi trường

### Development
```json
{
  "NODE_ENV": "development",
  "API_URL": "http://localhost:8080/petcenter"
}
```

### Production
```json
{
  "NODE_ENV": "production",
  "API_URL": "[production_url]/petcenter"
}
```

## API Endpoints

### Authentication
- `POST /auth/token` - Đăng nhập
- `POST /users/register` - Đăng ký
- `POST /auth/introspect` - Kiểm tra token
- `POST /auth/logout` - Đăng xuất

### Customer Management
- `GET /customers` - Lấy danh sách khách hàng
- `GET /customers/myInfo` - Lấy thông tin cá nhân
- `POST /customers` - Tạo khách hàng mới
- `PUT /customers/:id` - Cập nhật thông tin
- `DELETE /customers/:id` - Xóa khách hàng

### Staff Management
- `GET /staffs` - Lấy danh sách nhân viên
- `POST /users/staff-register` - Tạo nhân viên mới
- `PUT /staffs/:id` - Cập nhật thông tin
- `DELETE /staffs/:id` - Xóa nhân viên

### Pet Management
- `GET /pets` - Lấy danh sách thú cưng
- `POST /pets/:customerId` - Thêm thú cưng
- `PUT /pets/:id` - Cập nhật thông tin
- `DELETE /pets/:id` - Xóa thú cưng

## Dependencies Version

```json
{
  "dependencies": {
    "@ant-design/icons": "^6.0.0",
    "@heroicons/react": "^2.2.0",
    "axios": "^1.8.4",
    "js-cookie": "^3.0.5",
    "next": "15.2.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-toastify": "^11.0.5"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/axios": "^0.9.36",
    "@types/js-cookie": "^3.0.6",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/react-toastify": "^4.0.2",
    "eslint": "^9",
    "eslint-config-next": "15.2.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

## Development Setup

1. **Yêu cầu hệ thống**
   - Node.js v20 trở lên
   - npm v10 trở lên
   - Git

2. **Cài đặt dự án**
   ```bash
   git clone [repository_url]
   cd FE_Real
   npm install
   ```

3. **Chạy development server**
   ```bash
   npm run dev
   ```

4. **Build production**
   ```bash
   npm run build
   npm start
   ```

## Coding Standards

1. **TypeScript**
   - Sử dụng strict mode
   - Định nghĩa type/interface cho tất cả các props
   - Không sử dụng any type

2. **Component Structure**
   - Sử dụng functional components
   - Tách logic phức tạp vào custom hooks
   - Props validation với TypeScript

3. **Styling**
   - Sử dụng Tailwind CSS utilities
   - Mobile-first responsive design
   - Tổ chức class theo độ ưu tiên
