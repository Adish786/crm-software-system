package com.crm.dto;


import com.crm.enums.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Schema(description = "DTO for updating an existing task")
public class TaskUpdateRequest {

    @Schema(description = "Title of the task", example = "Updated task title")
    private String title;

    @Schema(description = "Detailed description of the task", example = "Updated description")
    private String description;

    @Schema(description = "Due date for the task", example = "2024-12-31")
    private LocalDate dueDate;

    @Schema(description = "Priority level of the task", example = "MEDIUM")
    private String priority;

    @Schema(description = "ID of the user assigned to this task", example = "2")
    private Long assignedToId;

    @Schema(description = "Status of the task", example = "IN_PROGRESS")
    private TaskStatus status;

    // Constructors
    public TaskUpdateRequest() {}

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
