package com.crm.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Request DTO for creating a new lead")
public class CreateLeadRequest {

    @NotBlank(message = "Lead name is required")
    @Schema(description = "Full name of the lead", example = "Jane Smith", required = true)
    private String name;

    @Schema(description = "Contact information", example = "jane.smith@example.com")
    private String contactInfo;

    @Schema(description = "Lead source", example = "Website Form")
    private String source;

    @Schema(description = "ID of the assigned sales representative", example = "1")
    private Long assignedSalesRepId;

    // Constructors, getters, and setters
    public CreateLeadRequest() {}

    public CreateLeadRequest(String name, String contactInfo, String source, Long assignedSalesRepId) {
        this.name = name;
        this.contactInfo = contactInfo;
        this.source = source;
        this.assignedSalesRepId = assignedSalesRepId;
    }

    // Getters and setters...
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Long getAssignedSalesRepId() { return assignedSalesRepId; }
    public void setAssignedSalesRepId(Long assignedSalesRepId) { this.assignedSalesRepId = assignedSalesRepId; }
}
