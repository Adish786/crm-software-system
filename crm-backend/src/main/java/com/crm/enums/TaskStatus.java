package com.crm.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Possible status values for a task in the CRM system")
public enum TaskStatus {

    @Schema(description = "Task has been created but not started")
    PENDING,

    @Schema(description = "Task is currently in progress")
    IN_PROGRESS,

    @Schema(description = "Task has been completed")
    COMPLETED,

    @Schema(description = "Task has been cancelled")
    CANCELLED,

    @Schema(description = "Task is on hold")
    ON_HOLD,

    @Schema(description = "Task is overdue")
    OVERDUE
}