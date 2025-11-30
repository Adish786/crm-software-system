package com.crm.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Possible status values for a sale in the CRM system")
public enum SaleStatus {

    @Schema(description = "Initial proposal stage before approval")
    PROPOSAL,

    @Schema(description = "Sale is pending approval or processing")
    PENDING,

    @Schema(description = "Sale has been approved and is in progress")
    APPROVED,

    @Schema(description = "Sale has been successfully completed")
    COMPLETED,

    @Schema(description = "Sale payment is pending")
    PAYMENT_PENDING,

    @Schema(description = "Sale is on hold temporarily")
    ON_HOLD,

    @Schema(description = "Sale was cancelled")
    CANCELLED,

    @Schema(description = "Sale has been refunded")
    REFUNDED
}