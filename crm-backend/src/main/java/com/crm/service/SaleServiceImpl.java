package com.crm.service;

import com.crm.exceptionhandler.ResourceNotFoundException;
import com.crm.model.Sale;
import com.crm.model.User;
import com.crm.repository.SaleRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@Transactional
public class SaleServiceImpl implements SaleService {

    private static final Logger logger = LoggerFactory.getLogger(SaleServiceImpl.class);
    private final SaleRepository saleRepository;

    public SaleServiceImpl(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    private String getRole(User user) {
        String role = user.getRole().toString();
        return role.startsWith("ROLE") ? role.substring(5) : role;
    }

    @Override
    @Async
    public CompletableFuture<Sale> createSale(Sale sale, User user) {
        logger.info("Creating sale for user: {}", user.getEmail());
        if (sale.getAssignedSalesRep() == null) {
            sale.setAssignedSalesRep(user);
        }
        sale.setCreatedBy(user.getId());
        Sale savedSale = saleRepository.save(sale);
        logger.info("Sale created successfully with ID: {}", savedSale.getId());
        return CompletableFuture.completedFuture(savedSale);
    }

    @Override
    @Async
    public CompletableFuture<List<Sale>> getAllSales(User user) {
        logger.info("Fetching all sales (UNRESTRICTED ACCESS)");
        try {
            List<Sale> sales = saleRepository.findAll();
            logger.info("Found {} sales (full list)", sales.size());
            return CompletableFuture.completedFuture(sales);

        } catch (Exception e) {
            logger.error("Error fetching sales: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch sales: " + e.getMessage());
        }
    }

    @Override
    @Async
    public CompletableFuture<Sale> getSaleById(Long id, User user) {
        logger.info("Fetching sale by ID: {} (UNRESTRICTED ACCESS)", id);

        try {
            Sale sale = saleRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));
            logger.info("Sale access granted for user {}", user.getEmail());
            return CompletableFuture.completedFuture(sale);

        } catch (ResourceNotFoundException e) {
            logger.error("Sale not found with id: {}", id);
            throw new RuntimeException("Sale not found: " + e.getMessage());
        }
    }

    @Override
    @Async
    public CompletableFuture<Sale> updateSale(Long id, Sale updatedSale, User user) {
        logger.info("Updating sale ID: {} (UNRESTRICTED ACCESS)", id);

        try {
            Sale sale = saleRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));
            sale.setAmount(updatedSale.getAmount());
            sale.setStatus(updatedSale.getStatus());
            sale.setCustomer(updatedSale.getCustomer());
            sale.setDate(updatedSale.getDate());
            sale.setNotes(updatedSale.getNotes());
            Sale saved = saleRepository.save(sale);
            logger.info("Sale updated successfully: {}", saved.getId());
            return CompletableFuture.completedFuture(saved);

        } catch (ResourceNotFoundException e) {
            logger.error("Sale not found during update: {}", id);
            throw new RuntimeException("Sale not found: " + e.getMessage());
        }
    }

    @Override
    @Async
    public CompletableFuture<Void> deleteSale(Long id, User user) {
        logger.info("Deleting sale ID: {} (UNRESTRICTED ACCESS)", id);
        try {
            Sale sale = saleRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));

            saleRepository.delete(sale);
            logger.info("Sale deleted successfully: {}", id);
            return CompletableFuture.completedFuture(null);

        } catch (ResourceNotFoundException e) {
            logger.error("Sale not found during deletion: {}", id);
            throw new RuntimeException("Sale not found: " + e.getMessage());
        }
    }
}