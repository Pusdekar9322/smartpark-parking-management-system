# SmartPark REST API Documentation 🔌

Swagger / OpenAPI documentation is hosted at `http://localhost:8080/swagger-ui.html` when the backend is running.

All responses use a standardized JSON wrapper:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-08-30T10:00:00"
}
```

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register customer account (returns JWT) |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials (returns JWT & role) |

---

## 2. User Profile (`/api/users`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/me` | Authenticated | Retrieve current user profile |
| `PUT` | `/api/users/me` | Authenticated | Update full name and mobile number |
| `PUT` | `/api/users/me/password` | Authenticated | Update password with old password verification |

---

## 3. Vehicle Management (`/api/vehicles`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/vehicles` | Customer | List logged-in user's vehicles |
| `POST` | `/api/vehicles` | Customer | Register new vehicle with Indian license format |
| `GET` | `/api/vehicles/{id}` | Customer | Get vehicle details |
| `PUT` | `/api/vehicles/{id}` | Customer | Update vehicle information |
| `DELETE` | `/api/vehicles/{id}` | Customer | Remove vehicle from garage |

---

## 4. Parking Facilities & Availability (`/api/parking`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/parking/locations` | Public | List parking facilities (filter by city, vehicleType, time) |
| `GET` | `/api/parking/locations/{id}` | Public | Get parking facility overview |
| `GET` | `/api/parking/locations/{id}/availability` | Public | Interactive floor & slot availability matrix |
| `GET` | `/api/parking/pricing` | Public | List pricing rules across all vehicle types |
| `POST` | `/api/parking/calculate-fee` | Public | Dynamic fee estimator with weekend surcharge & GST |

---

## 5. Bookings (`/api/bookings`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Customer | Create advance reservation (checks slot overlap) |
| `GET` | `/api/bookings/my` | Customer | Retrieve all bookings for current customer |
| `GET` | `/api/bookings/{id}` | Authenticated | Get booking details by ID |
| `GET` | `/api/bookings/number/{num}` | Authenticated | Get booking details by booking number |
| `PUT` | `/api/bookings/{id}/cancel` | Customer | Cancel reservation |

---

## 6. Payments (`/api/payments`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create-order` | Authenticated | Generate Razorpay sandbox order ID |
| `POST` | `/api/payments/verify` | Authenticated | Verify Razorpay HMAC signature & complete booking |
| `GET` | `/api/payments/{id}` | Authenticated | Retrieve transaction receipt |
| `GET` | `/api/payments/booking/{id}`| Authenticated | Retrieve payment for booking |

---

## 7. Invoices (`/api/invoices`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/invoices/{id}` | Authenticated | Retrieve GST invoice JSON data |
| `GET` | `/api/invoices/{id}/pdf` | Authenticated | Download GST invoice as binary PDF file |
| `GET` | `/api/invoices/booking/{bId}`| Authenticated | Get invoice for booking |

---

## 8. Coupons (`/api/coupons`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/coupons/apply` | Authenticated | Validate promo code and calculate discount amount |
| `GET` | `/api/coupons/active` | Public | List currently active promotional coupons |

---

## 9. Monthly Passes (`/api/passes`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/passes` | Customer | Purchase 30-day parking subscription |
| `GET` | `/api/passes/my` | Customer | List customer active and expired passes |
| `PUT` | `/api/passes/{id}/cancel`| Customer | Cancel active pass |

---

## 10. Notifications (`/api/notifications`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Authenticated | Get user notification feed |
| `GET` | `/api/notifications/unread-count` | Authenticated | Get unread badge counter |
| `PUT` | `/api/notifications/{id}/read` | Authenticated | Mark notification as read |
| `PUT` | `/api/notifications/read-all` | Authenticated | Mark all notifications as read |

---

## 11. Parking Facility Admin (`/api/admin`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin | Facility KPI metrics & occupancy rate |
| `POST` | `/api/admin/check-in` | Admin | Terminal Gate Entry barrier validation |
| `POST` | `/api/admin/check-out` | Admin | Terminal Gate Exit barrier & duration billing |
| `GET` | `/api/admin/bookings` | Admin | Live monitor of facility reservations |
| `GET` | `/api/admin/payments` | Admin | Facility payment transactions audit |
| `POST` | `/api/admin/locations` | Admin | Create new facility |
| `PUT` | `/api/admin/locations/{id}` | Admin | Update facility hours/address |
| `DELETE`| `/api/admin/locations/{id}` | Admin | Deactivate facility |
| `POST` | `/api/admin/floors` | Admin | Add multi-level floor |
| `POST` | `/api/admin/slots` | Admin | Add parking slot |
| `PUT` | `/api/admin/slots/{id}/maintenance` | Admin | Toggle maintenance state |
| `POST` | `/api/admin/pricing` | Admin | Configure tariff rules |
| `POST` | `/api/admin/coupons` | Admin | Create promo coupon |

---

## 12. Super Admin (`/api/super-admin`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/super-admin/dashboard` | Super Admin | System-wide statistics & revenue |
| `GET` | `/api/super-admin/users` | Super Admin | List all registered motorists |
| `PUT` | `/api/super-admin/users/{id}/status` | Super Admin | Suspend or activate user |
| `GET` | `/api/super-admin/admins` | Super Admin | List all parking administrators |
| `POST` | `/api/super-admin/admins` | Super Admin | Provision new Parking Facility Admin |
| `GET` | `/api/super-admin/locations` | Super Admin | All multi-city parking facilities |
| `GET` | `/api/super-admin/bookings` | Super Admin | Global bookings log |
| `GET` | `/api/super-admin/payments` | Super Admin | Global transaction revenue ledger |
