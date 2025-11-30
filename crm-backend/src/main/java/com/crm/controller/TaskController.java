package com.crm.controller;


import com.crm.model.Task;
import com.crm.dto.TaskCreateRequest;
import com.crm.dto.TaskUpdateRequest;
import com.crm.dto.TaskStatusUpdateRequest;
import com.crm.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Tasks", description = "Task management APIs")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Operation(
            summary = "Get all tasks",
            description = "Retrieves a paginated list of all tasks with optional filtering and sorting"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved tasks",
                    content = @Content(schema = @Schema(implementation = Task.class, type = "array"))
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public CompletableFuture<ResponseEntity<Page<Task>>> getAllTasks(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "dueDate") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "ASC") String direction,
            @Parameter(description = "Filter by status") @RequestParam(required = false) String status,
            @Parameter(description = "Filter by priority") @RequestParam(required = false) String priority,
            @Parameter(description = "Filter by assigned user ID") @RequestParam(required = false) Long assignedTo,
            @Parameter(description = "Filter by due date from (yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @Parameter(description = "Filter by due date to (yyyy-MM-dd)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        return taskService.findAllTasks(pageable, status, priority, assignedTo, fromDate, toDate)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Get task by ID",
            description = "Retrieves a specific task by its unique identifier"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Task found successfully",
                    content = @Content(schema = @Schema(implementation = Task.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Task not found",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<Task>> getTaskById(
            @Parameter(description = "Task ID", example = "1", required = true)
            @PathVariable Long id) {
        return taskService.findById(id)
                .thenApply(task -> task.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build()));
    }

    @Operation(
            summary = "Create a new task",
            description = "Creates a new task with the provided details"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Task created successfully",
                    content = @Content(schema = @Schema(implementation = Task.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid task data provided",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Assigned user not found",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public CompletableFuture<ResponseEntity<Task>> createTask(
            @Parameter(description = "Task data to create", required = true)
            @Valid @RequestBody TaskCreateRequest request) {
        return taskService.createTask(request)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Update task",
            description = "Updates an existing task's information"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Task updated successfully",
                    content = @Content(schema = @Schema(implementation = Task.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Task not found",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<Task>> updateTask(
            @Parameter(description = "Task ID", example = "1", required = true)
            @PathVariable Long id,
            @Parameter(description = "Updated task data", required = true)
            @Valid @RequestBody TaskUpdateRequest request) {
        return taskService.updateTask(id, request)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Update task status",
            description = "Updates only the status of a specific task"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Task status updated successfully",
                    content = @Content(schema = @Schema(implementation = Task.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Task not found",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/status")
    public CompletableFuture<ResponseEntity<Task>> updateTaskStatus(
            @Parameter(description = "Task ID", example = "1", required = true)
            @PathVariable Long id,
            @Parameter(description = "New status for the task", required = true)
            @Valid @RequestBody TaskStatusUpdateRequest request) {
        return taskService.updateTaskStatus(id, request.getStatus())
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Delete task",
            description = "Permanently deletes a task from the system"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Task deleted successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Task not found",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> deleteTask(
            @Parameter(description = "Task ID", example = "1", required = true)
            @PathVariable Long id) {
        return taskService.deleteTask(id)
                .thenApply(v -> ResponseEntity.ok().<Void>build())
                .exceptionally(ex -> ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Get tasks by assigned user",
            description = "Retrieves all tasks assigned to a specific user"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved user tasks",
                    content = @Content(schema = @Schema(implementation = Task.class, type = "array"))
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping("/assigned-to/{userId}")
    public CompletableFuture<ResponseEntity<List<Task>>> getTasksByAssignedUser(
            @Parameter(description = "User ID", example = "1", required = true)
            @PathVariable Long userId) {
        return taskService.findByAssignedTo(userId)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Get overdue tasks",
            description = "Retrieves all tasks that are overdue"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved overdue tasks",
                    content = @Content(schema = @Schema(implementation = Task.class, type = "array"))
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping("/overdue")
    public CompletableFuture<ResponseEntity<List<Task>>> getOverdueTasks() {
        return taskService.findOverdueTasks()
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Get tasks due today",
            description = "Retrieves all tasks that are due today"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved today's tasks",
                    content = @Content(schema = @Schema(implementation = Task.class, type = "array"))
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping("/due-today")
    public CompletableFuture<ResponseEntity<List<Task>>> getTasksDueToday() {
        return taskService.findTasksDueToday()
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Get task statistics",
            description = "Retrieves statistics about tasks"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Statistics retrieved successfully",
                    content = @Content(schema = @Schema(implementation = Object.class))
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping("/statistics")
    public CompletableFuture<ResponseEntity<Object>> getTaskStatistics() {
        return taskService.getTaskStatistics()
                .thenApply(ResponseEntity::ok);
    }
}
