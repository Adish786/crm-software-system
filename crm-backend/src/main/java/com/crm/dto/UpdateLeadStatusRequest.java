package com.crm.dto;


import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO for updating lead status")
public class UpdateLeadStatusRequest {

    @Schema(description = "New status for the lead", example = "CONTACTED", required = true)
    private String status;

    // Constructors
    public UpdateLeadStatusRequest() {}

    public UpdateLeadStatusRequest(String status) {
        this.status = status;
    }

    // Getters and setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
