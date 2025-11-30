package com.crm.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Possible role values for a user in the CRM system")
public enum Role {

    @Schema(description = "Administrator with full system access")
    ADMIN,

    @Schema(description = "Sales representative with sales-related access")
    SALES,

    @Schema(description = "Regular user with basic access")
    USER,

    @Schema(description = "Manager with team management capabilities")
    MANAGER,
}