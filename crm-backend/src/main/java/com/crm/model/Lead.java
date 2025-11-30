package com.crm.model;

import com.crm.enums.LeadStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Schema(description = "Lead entity representing a potential customer in the CRM system")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier of the lead", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Column(nullable = false)
    @Schema(description = "Full name of the lead", example = "Jane Smith", required = true)
    private String name;

    @Schema(description = "Contact information of the lead", example = "jane.smith@example.com")
    private String contactInfo;

    @Schema(description = "Source where the lead came from", example = "Website Form")
    private String source;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Current status of the lead", example = "NEW")
    private LeadStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_sales_rep_id")
    @Schema(description = "Sales representative assigned to this lead")
    private User assignedSalesRep;

    @CreationTimestamp
    @Column(name = "created_date", updatable = false)
    @Schema(description = "Date and time when the lead was created", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdDate;

    @Schema(description = "Date when the lead was last updated")
    private LocalDateTime updatedDate;

    // Constructors
    public Lead() {}

    public Lead(String name, String contactInfo, String source, LeadStatus status, User assignedSalesRep) {
        this.name = name;
        this.contactInfo = contactInfo;
        this.source = source;
        this.status = status;
        this.assignedSalesRep = assignedSalesRep;
    }

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public LeadStatus getStatus() { return status; }
    public void setStatus(LeadStatus status) { this.status = status; }
    public User getAssignedSalesRep() { return assignedSalesRep; }
    public void setAssignedSalesRep(User assignedSalesRep) { this.assignedSalesRep = assignedSalesRep; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
}