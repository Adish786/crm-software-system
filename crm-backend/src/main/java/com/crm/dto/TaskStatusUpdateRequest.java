package com.crm.dto;


import com.crm.enums.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "DTO for updating task status")
public class TaskStatusUpdateRequest {

    @NotNull(message = "Status is required")
    @Schema(description = "New status for the task", example = "COMPLETED", required = true)
    private TaskStatus status;

    // Constructors
    public TaskStatusUpdateRequest() {}

    public TaskStatusUpdateRequest(TaskStatus status) {
        this.status = status;
    }

    // Getters and setters
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
}
