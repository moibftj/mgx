# POS System Development Plan

## MVP Features to Implement:

### 1. Authentication System
- Login page with email/password
- Registration page (auto-assigns Rider role)
- Role-based access (Admin vs Rider)
- Default admin: Fadlannafian@gmail.com

### 2. Core Pages Structure
- Dashboard (Admin: full analytics, Rider: basic info)
- Products Management (Admin only)
- Warehouse/Storage (Admin only)
- Distribution (Admin only)
- Categories (Admin only)
- Reports (Admin: full reports, Rider: own transactions)
- Settings/Profile (role-based features)
- POS Interface (Rider primary interface)

### 3. Data Models
- Users (id, email, name, role, profile_picture)
- Products (id, name, price, category_id, description)
- Categories (id, name, description)
- Warehouse_Stock (product_id, quantity_in_warehouse)
- Rider_Stock (rider_id, product_id, quantity_distributed)
- Transactions (id, rider_id, products, total, date)
- Tax_Settings (rate, enabled)

### 4. Key Functionalities
- Product distribution from warehouse to riders
- Product return from riders to warehouse
- POS sales interface for riders
- Sales reporting and analytics
- User management (Admin only)

### Files to Create:
1. src/contexts/AuthContext.tsx - Authentication state management
2. src/pages/Login.tsx - Login interface
3. src/pages/Register.tsx - Registration interface
4. src/pages/Dashboard.tsx - Main dashboard
5. src/pages/Products.tsx - Product management
6. src/pages/Warehouse.tsx - Warehouse management
7. src/pages/Distribution.tsx - Product distribution
8. src/pages/POS.tsx - Point of sale interface
9. src/components/Navbar.tsx - Navigation component
10. src/lib/mockData.ts - Mock data for development