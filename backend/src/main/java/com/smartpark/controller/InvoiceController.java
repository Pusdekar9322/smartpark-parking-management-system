package com.smartpark.controller;

import com.smartpark.dto.response.ApiResponse;
import com.smartpark.dto.response.InvoiceResponse;
import com.smartpark.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoices", description = "GST-compliant Invoice retrieval and PDF generation APIs")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/{id}")
    @Operation(summary = "Get invoice details by invoice ID")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceById(@PathVariable Long id) {
        InvoiceResponse response = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get invoice by booking ID")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceByBookingId(@PathVariable Long bookingId) {
        InvoiceResponse response = invoiceService.getInvoiceByBookingId(bookingId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/pdf")
    @Operation(summary = "Download printable PDF invoice")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable Long id) {
        byte[] pdfBytes = invoiceService.getInvoicePdf(id);
        InvoiceResponse inv = invoiceService.getInvoiceById(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Invoice-" + inv.getInvoiceNumber() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
