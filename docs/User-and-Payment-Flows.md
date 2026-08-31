# SmartPark User & Payment Flow Diagrams 🔄

## 1. Customer Online Reservation Flow (Razorpay Sandbox)

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Frontend as React 18 SPA
    participant Backend as Spring Boot API
    participant DB as MySQL 8.0
    participant Gateway as Razorpay Sandbox

    Customer->>Frontend: Selects Location, Time, Vehicle & Slot
    Customer->>Frontend: Enters Coupon "PUNE50" & chooses "Online Payment"
    Frontend->>Backend: POST /api/bookings (vehicleId, slotId, time, paymentMethod="ONLINE_UPI")
    
    Backend->>DB: Check Overlapping Bookings on Slot
    alt Slot is already booked for that interval
        DB-->>Backend: Existing booking found
        Backend-->>Frontend: 400 Conflict (SlotNotAvailableException)
        Frontend-->>Customer: Shows Error: "Slot already booked. Choose another."
    else Slot is Available
        Backend->>Backend: Calculate dynamic fee + GST + discount
        Backend->>Backend: Generate QR Pass (ZXing Base64)
        Backend->>DB: Save Booking (status="RESERVED", payment="PENDING")
        Backend-->>Frontend: Returns Booking with bookingNumber & QR
        
        Frontend->>Backend: POST /api/payments/create-order (bookingId)
        Backend->>Gateway: Create Order (amount in paise, currency INR)
        Gateway-->>Backend: orderId (e.g. order_rzp_test_12345)
        Backend-->>Frontend: Returns orderId
        
        Frontend->>Customer: Opens Razorpay Sandbox Modal (UPI/Card)
        Customer->>Frontend: Clicks Pay (simulates UPI success)
        
        Frontend->>Backend: POST /api/payments/verify (orderId, paymentId, signature)
        Backend->>Backend: Verify HMAC SHA256 Signature
        Backend->>DB: Save Payment (status="SUCCESS"), Update Booking (paymentStatus="SUCCESS")
        Backend->>Backend: OpenPDF: Generate GST Invoice
        Backend->>DB: Save Invoice record
        Backend-->>Frontend: Verification Successful
        Frontend-->>Customer: Shows Confetti & Booking Confirmation Screen
    end
```

---

## 2. Pay at Parking Counter Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Frontend as React 18 SPA
    participant Backend as Spring Boot API
    participant DB as MySQL 8.0

    Customer->>Frontend: Chooses "Pay at Parking" option
    Frontend->>Backend: POST /api/bookings (paymentMethod="CASH_AT_PARKING")
    Backend->>DB: Check Slot Overlap
    Backend->>Backend: Calculate estimated fee + Generate QR Code
    Backend->>DB: Save Booking (status="RESERVED", paymentStatus="PENDING")
    Backend-->>Frontend: Returns Booking
    Frontend-->>Customer: Shows Digital QR Ticket with "Pay at Gate Exit" notice
```

---

## 3. Gate Attendant Terminal: Check-In & Check-Out Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Attendant as Gate Attendant / Admin
    participant Terminal as Admin Terminal (React)
    participant Backend as Spring Boot API
    participant DB as MySQL 8.0

    Note over Attendant,Terminal: Vehicle Arrives at Entrance Gate
    Attendant->>Terminal: Scans QR Ticket / Enters "SP-PN-2026-000001"
    Terminal->>Backend: POST /api/admin/check-in (bookingIdentifier)
    Backend->>DB: Find Booking by Number
    Backend->>Backend: Validate scheduled arrival window
    Backend->>DB: Update Booking (actualEntryTime=now, bookingStatus="CHECKED_IN", slot.status="OCCUPIED")
    Backend-->>Terminal: Check-in Approved & Slot Details Displayed
    Terminal-->>Attendant: Barrier Raised: Entry Permitted

    Note over Attendant,Terminal: Vehicle Arrives at Exit Gate
    Attendant->>Terminal: Scans QR Pass / Enters Booking Ref
    Terminal->>Backend: POST /api/admin/check-out (bookingIdentifier, paymentMethod="CASH_AT_PARKING")
    Backend->>Backend: Calculate actual parked duration
    Backend->>Backend: If duration exceeded, recalculate final fee
    Backend->>DB: If unpaid, record Payment (status="SUCCESS")
    Backend->>DB: Update Booking (actualExitTime=now, bookingStatus="COMPLETED", slot.status="AVAILABLE")
    Backend->>Backend: Generate Official GST Tax Invoice
    Backend->>DB: Save Invoice
    Backend-->>Terminal: Returns final amount & Invoice download link
    Terminal-->>Attendant: Barrier Raised: Vehicle Exited
```
