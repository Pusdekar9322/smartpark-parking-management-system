package com.smartpark.service.impl;

import com.smartpark.dto.response.InvoiceResponse;
import com.smartpark.entity.Booking;
import com.smartpark.entity.Invoice;
import com.smartpark.exception.ResourceNotFoundException;
import com.smartpark.repository.InvoiceRepository;
import com.smartpark.service.InvoiceService;
import com.smartpark.util.PdfInvoiceGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PdfInvoiceGenerator pdfInvoiceGenerator;

    @Value("${app.tax.gst-enabled:true}")
    private boolean gstEnabled;

    @Value("${app.tax.cgst-rate:9.0}")
    private double cgstRate;

    @Value("${app.tax.sgst-rate:9.0}")
    private double sgstRate;

    @Override
    @Transactional
    public Invoice generateInvoice(Booking booking) {
        return invoiceRepository.findByBookingId(booking.getId()).orElseGet(() -> {
            LocalDateTime entry = booking.getActualEntryTime() != null ? booking.getActualEntryTime() : booking.getStartTime();
            LocalDateTime exit = booking.getActualExitTime() != null ? booking.getActualExitTime() : booking.getEndTime();

            long minutes = Duration.between(entry, exit).toMinutes();
            if (minutes < 1) minutes = 1;
            double durationHrs = Math.round((minutes / 60.0) * 100.0) / 100.0;

            BigDecimal gross = booking.getFinalAmount() != null ? booking.getFinalAmount() : booking.getEstimatedAmount();
            BigDecimal discount = booking.getDiscountAmount() != null ? booking.getDiscountAmount() : BigDecimal.ZERO;
            BigDecimal net = gross.subtract(discount).max(BigDecimal.ZERO);

            BigDecimal cgst = BigDecimal.ZERO;
            BigDecimal sgst = BigDecimal.ZERO;
            if (gstEnabled) {
                cgst = net.multiply(BigDecimal.valueOf(cgstRate / 100.0)).setScale(2, RoundingMode.HALF_UP);
                sgst = net.multiply(BigDecimal.valueOf(sgstRate / 100.0)).setScale(2, RoundingMode.HALF_UP);
            }

            BigDecimal total = net.add(cgst).add(sgst).setScale(2, RoundingMode.HALF_UP);

            String invNumber = "INV-" + LocalDateTime.now().getYear() + "-" +
                    String.format("%06d", (int) (Math.random() * 900000) + 100000);

            Invoice invoice = Invoice.builder()
                    .invoiceNumber(invNumber)
                    .booking(booking)
                    .customerName(booking.getUser().getFullName())
                    .customerMobile(booking.getUser().getMobileNumber())
                    .vehicleNumber(booking.getVehicle().getVehicleNumber())
                    .vehicleType(booking.getVehicle().getVehicleType())
                    .locationName(booking.getParkingLocation().getName())
                    .locationAddress(booking.getParkingLocation().getAddress() + ", " + booking.getParkingLocation().getCity())
                    .floorName(booking.getParkingFloor().getFloorName())
                    .slotNumber(booking.getParkingSlot().getSlotNumber())
                    .entryTime(entry)
                    .exitTime(exit)
                    .durationHours(durationHrs)
                    .parkingCharges(gross)
                    .discountAmount(discount)
                    .cgstAmount(cgst)
                    .sgstAmount(sgst)
                    .totalAmount(total)
                    .paymentMethod(booking.getPaymentMethod())
                    .paymentStatus(booking.getPaymentStatus())
                    .generatedAt(LocalDateTime.now())
                    .build();

            return invoiceRepository.save(invoice);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + invoiceId));
        return mapToResponse(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceByBookingId(Long bookingId) {
        Invoice invoice = invoiceRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found for booking id: " + bookingId));
        return mapToResponse(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] getInvoicePdf(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + invoiceId));
        return pdfInvoiceGenerator.generateInvoicePdf(invoice);
    }

    private InvoiceResponse mapToResponse(Invoice inv) {
        return InvoiceResponse.builder()
                .id(inv.getId())
                .invoiceNumber(inv.getInvoiceNumber())
                .bookingId(inv.getBooking().getId())
                .bookingNumber(inv.getBooking().getBookingNumber())
                .customerName(inv.getCustomerName())
                .customerMobile(inv.getCustomerMobile())
                .vehicleNumber(inv.getVehicleNumber())
                .vehicleType(inv.getVehicleType())
                .locationName(inv.getLocationName())
                .locationAddress(inv.getLocationAddress())
                .floorName(inv.getFloorName())
                .slotNumber(inv.getSlotNumber())
                .entryTime(inv.getEntryTime())
                .exitTime(inv.getExitTime())
                .durationHours(inv.getDurationHours())
                .parkingCharges(inv.getParkingCharges())
                .discountAmount(inv.getDiscountAmount())
                .cgstAmount(inv.getCgstAmount())
                .sgstAmount(inv.getSgstAmount())
                .totalAmount(inv.getTotalAmount())
                .paymentMethod(inv.getPaymentMethod())
                .paymentStatus(inv.getPaymentStatus())
                .generatedAt(inv.getGeneratedAt())
                .build();
    }
}
