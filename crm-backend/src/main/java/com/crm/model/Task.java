package com.crm.model;

import com.crm.enums.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Schema(description = "Task entity representing a task in the CRM system")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier of the task", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Title is required")
    @Schema(description = "Title of the task", example = "Follow up with client", required = true)
    private String title;

    @Schema(description = "Detailed description of the task", example = "Call the client to discuss project requirements")
    private String description;

    @Schema(description = "Due date for the task", example = "2024-12-31")
    private LocalDate dueDate;

    @Schema(description = "Priority level of the task",
            example = "HIGH",
            allowableValues = {"LOW", "MEDIUM", "HIGH", "URGENT"})
    private String priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    @Schema(description = "User assigned to this task")
    private User assignedTo;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Current status of the task",
            example = "PENDING",
            implementation = TaskStatus.class)
    private TaskStatus status;

    // Constructors
    public Task() {}

    public Task(String title, String description, LocalDate dueDate, String priority, User assignedTo, TaskStatus status) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.assignedTo = assignedTo;
        this.status = status;
    }

    // Getters and Setters with Schema annotations
    @Schema(description = "Unique identifier of the task", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @Schema(description = "Title of the task", example = "Follow up with client", required = true)
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    @Schema(description = "Detailed description of the task", example = "Call the client to discuss project requirements")
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Schema(description = "Due date for the task", example = "2024-12-31")
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    @Schema(description = "Priority level of the task",
            example = "HIGH",
            allowableValues = {"LOW", "MEDIUM", "HIGH", "URGENT"})
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    @Schema(description = "User assigned to this task")
    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }

    @Schema(description = "Current status of the task",
            example = "PENDING",
            implementation = TaskStatus.class)
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    @Override
    public String toString() {
        return "Task{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", dueDate=" + dueDate +
                ", priority='" + priority + '\'' +
                ", assignedTo=" + (assignedTo != null ? assignedTo.getId() : "null") +
                ", status=" + status +
                '}';
    }
}