# SmartPark – Advanced Smart Parking & Gate Management Platform 🇮🇳

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Java](https://img.shields.io/badge/Java-22-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)

SmartPark is an enterprise-grade full-stack smart parking reservation, dynamic tariff calculation, gate barrier management, and automated GST billing application tailored for Indian urban infrastructure (featuring realistic Pune commercial hubs).

---

## 🌟 Key Highlights

1. **Monolithic Architecture with Layered Decoupling**: Built strictly using Spring Boot 3 (Java 22) + React 18 + MySQL 8.0 without over-engineered microservices.
2. **Double-Booking Overlap Engine**: Prevents race conditions and double-bookings with rigorous SQL interval overlap verification:
   $$(b.\text{startTime} < \text{requestedEndTime}) \land (b.\text{endTime} > \text{requestedStartTime})$$
3. **Dual Payment Modalities**:
   - **Online Payments**: Razorpay Sandbox simulation with HMAC SHA-256 signature verification (UPI, Debit/Credit Cards, NetBanking).
   - **Pay at Parking**: Contactless reservation with payment settlement at the parking exit barrier.
4. **Interactive Multi-Level Slot Selector**: Visual floor grid with real-time slot states (Available, Occupied, Selected, Maintenance, Vehicle Compatibility).
5. **Gate Attendant Scanner Terminal**: Real-time validation of QR tickets with instantaneous entry approval, duration tracking, and automatic overstay tariff recalculation.
6. **Automated GST-Compliant Invoices**: Instant PDF invoice generation via OpenPDF with itemized CGST (9%) and SGST (9%) breakdown.
7. **Monthly Parking Passes**: 30-day subscription pass plans for Two-Wheelers, Cars, SUVs, and Electric Vehicles.

---

## 🏗️ Architecture & Database Schema

- **[System Architecture Documentation](docs/System-Architecture.md)**
- **[Database ER Diagram (12 Entities)](docs/ER-Diagram.md)**
- **[REST API Specifications & Swagger Guide](docs/API-Documentation.md)**
- **[User & Payment Sequence Flows](docs/User-and-Payment-Flows.md)**

---

## 🔑 Pre-Seeded Demo Accounts

The application automatically seeds the MySQL database on startup with realistic Pune parking facilities and demo users:

| Role | Email | Password | Pre-Assigned Facility |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@smartpark.in` | `Admin@123` | *All Multi-City Facilities* |
| **Parking Facility Admin** | `admin.pune@smartpark.in` | `Admin@123` | *Phoenix Marketcity Parking (Pune)* |
| **Registered Customer** | `customer@smartpark.in` | `Customer@123` | *Vehicles: `MH 12 AB 1234`, `MH 14 CD 5678`* |

> *Tip: The Login page features 1-click quick fill buttons for instant evaluation.*

---

## 🚀 Getting Started

### 1. Prerequisites
- **Java JDK 22** or 17+
- **Node.js 18+** & npm
- **MySQL Server 8.0+** running locally on port `3306`

### 2. Database Setup
Create the MySQL database:
```sql
CREATE DATABASE smartpark_db;
```

Update your database credentials in `backend/src/main/resources/application.yml` or environment variables if different from default `root`/`root`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/smartpark_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Kolkata
    username: root
    password: root
```

### 3. Run Backend (Spring Boot 3)
```bash
cd backend
mvn spring-boot:run
```
- **Backend API**: `http://localhost:8080`
- **OpenAPI / Swagger UI**: `http://localhost:8080/swagger-ui.html`

### 4. Run Frontend (React 18 + Vite)
```bash
cd frontend
npm install
npm run dev
```
- **Frontend App**: `http://localhost:5173`

---

## 🧪 Testing & Validation

### Run Automated Backend Unit Tests
```bash
cd backend
mvn test
```
- Tests `FeeCalculatorTest` (Tiered hours, fractional hour ceiling, weekend surcharges).
- Tests `BookingOverlapTest` (Scenario C: Double booking rejection on overlapping times).

---

## 💡 Java Full-Stack Interview Talking Points

1. **Why Monolith instead of Microservices for this project?**
   - Eliminates distributed transaction complexities (Saga/2PC) for slot reservation + payment + invoice workflows.
   - Ensures atomicity with `@Transactional` on booking and check-out operations.
2. **How is Double-Booking strictly prevented?**
   - The repository query filters active bookings (`RESERVED`, `CHECKED_IN`, `PARKED`) and evaluates interval intersection before persisting new bookings.
3. **Stateless Spring Security 6**:
   - Uses `SessionCreationPolicy.STATELESS` and a custom `JwtAuthenticationFilter` verifying HMAC SHA-256 tokens on every request.
4. **GST Calculation Rule (Rule 33 in PRD)**:
   - Base fee + ceil(extra hours) + weekend surcharge $\rightarrow$ Coupon discount $\rightarrow$ CGST (9%) + SGST (9%) calculated using `BigDecimal` with `RoundingMode.HALF_UP`.
5. **OpenPDF vs JasperReports**:
   - OpenPDF provides clean, lightweight, programmatic A4 PDF invoice creation without heavy runtime dependencies.

---

## 📄 License
MIT License - Built for Smart City Urban Infrastructure in India 🇮🇳.
