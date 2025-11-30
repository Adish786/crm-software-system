package com.crm.model;

import com.crm.enums.SaleStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "sales")
@Schema(description = "Sale entity representing a transaction in the CRM system")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier of the sale", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @Schema(description = "Customer associated with this sale")
    private Customer customer;

    @Schema(
            description = "Sale amount",
            example = "999.99",
            minimum = "0.01",
            required = true
    )
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Schema(
            description = "Current status of the sale",
            example = "PENDING",
            implementation = SaleStatus.class,
            required = true
    )
    private SaleStatus status;

    @Schema(
            description = "Date when the sale was created/occurred",
            example = "2024-01-15",
            required = true
    )
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_sales_rep_id")
    @Schema(description = "Sales representative assigned to this sale")
    private User assignedSalesRep;

    @Column(name = "created_by", nullable = false, updatable = false)
    @Schema(description = "User ID who created the sale", example = "101")
    private Long createdBy;

    @Column(length = 1000)
    @Schema(description = "Optional notes about the sale", example = "Followed up with customer")
    private String notes;

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    // Constructors
    public Sale() {}

    public Sale(Long id, Customer customer, Double amount, SaleStatus status, LocalDate date,
                User assignedSalesRep, Long createdBy, String notes) {
        this.id = id;
        this.customer = customer;
        this.amount = amount;
        this.status = status;
        this.date = date;
        this.assignedSalesRep = assignedSalesRep;
        this.createdBy = createdBy;
        this.notes = notes;
    }


    // Getters and Setters with Schema annotations
    @Schema(description = "Unique identifier of the sale", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @Schema(description = "Customer associated with this sale")
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    @Schema(
            description = "Sale amount",
            example = "999.99",
            minimum = "0.01",
            required = true
    )
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    @Schema(
            description = "Current status of the sale",
            example = "PENDING",
            implementation = SaleStatus.class,
            required = true
    )
    public SaleStatus getStatus() { return status; }
    public void setStatus(SaleStatus status) { this.status = status; }

    @Schema(
            description = "Date when the sale was created/occurred",
            example = "2024-01-15",
            required = true
    )
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    @Schema(description = "Sales representative assigned to this sale")
    public User getAssignedSalesRep() { return assignedSalesRep; }
    public void setAssignedSalesRep(User assignedSalesRep) { this.assignedSalesRep = assignedSalesRep; }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public String toString() {
        return "Sale{" +
                "id=" + id +
                ", customer=" + (customer != null ? customer.getId() : "null") +
                ", amount=" + amount +
                ", status=" + status +
                ", date=" + date +
                ", assignedSalesRep=" + (assignedSalesRep != null ? assignedSalesRep.getId() : "null") +
                '}';
    }
}