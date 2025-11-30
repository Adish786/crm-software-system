package com.crm.repository;


import com.crm.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import com.crm.model.Sale;
import com.crm.enums.SaleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByAssignedSalesRep(String email);
    List<Sale> findByStatus(SaleStatus status);
    List<Sale> findByCustomer(String customer);
    List<Sale> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Sale> findByAssignedSalesRepAndStatus(String email, SaleStatus status);
    long countByStatus(SaleStatus status);
}

