package com.crm.dto;


import com.crm.enums.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Schema(description = "DTO for creating a new task")
public class TaskCreateRequest {

    @NotBlank(message = "Title is required")
    @Schema(description = "Title of the task", example = "Follow up with client", required = true)
    private String title;

    @Schema(description = "Detailed description of the task", example = "Call the client to discuss project requirements")
    private String description;

    @Schema(description = "Due date for the task", example = "2024-12-31")
    private LocalDate dueDate;

    @Schema(description = "Priority level of the task", example = "HIGH")
    private String priority;

    @Schema(description = "ID of the user assigned to this task", example = "1")
    private Long assignedToId;

    @Schema(description = "Status of the task", example = "PENDING")
    private TaskStatus status;

    // Constructors
    public TaskCreateRequest() {}

    public TaskCreateRequest(String title, String description, LocalDate dueDate, String priority, Long assignedToId, TaskStatus status) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.assignedToId = assignedToId;
        this.status = status;
    }

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
}
