package com.crm.service;

import com.crm.exceptionhandler.ResourceNotFoundException;
import com.crm.model.Sale;
import com.crm.model.User;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface SaleService {

    CompletableFuture<Sale> createSale(Sale sale, User user);

    CompletableFuture<List<Sale>> getAllSales(User user);

    CompletableFuture<Sale> getSaleById(Long id, User user) throws ResourceNotFoundException;

    CompletableFuture<Sale> updateSale(Long id, Sale sale, User user);

    CompletableFuture<Void> deleteSale(Long id, User user);
}
