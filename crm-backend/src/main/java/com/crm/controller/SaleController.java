package com.crm.controller;

import com.crm.exceptionhandler.ResourceNotFoundException;
import com.crm.model.Sale;
import com.crm.model.User;
import com.crm.service.SaleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/sales")
@Tag(name = "Sales Controller", description = "Handles Sale CRUD operations in multi-threaded mode")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public CompletableFuture<ResponseEntity<Sale>> createSale(
            @RequestBody @Valid Sale sale,
            @AuthenticationPrincipal User user) {
        return saleService.createSale(sale, user)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping
    public CompletableFuture<ResponseEntity<List<Sale>>> getAllSales(
            @AuthenticationPrincipal User user) {

        return saleService.getAllSales(user)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<Sale>> getSaleById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) throws ResourceNotFoundException {

        return saleService.getSaleById(id, user)
                .thenApply(ResponseEntity::ok);
    }

    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<Sale>> updateSale(
            @PathVariable Long id,
            @RequestBody @Valid Sale sale,
            @AuthenticationPrincipal User user) {

        return saleService.updateSale(id, sale, user)
                .thenApply(ResponseEntity::ok);
    }

    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<String>> deleteSale(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        return saleService.deleteSale(id, user)
                .thenApply(v -> ResponseEntity.ok("Sale deleted successfully"));
    }
}
