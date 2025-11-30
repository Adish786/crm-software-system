package com.crm.service;


import com.crm.model.Task;
import com.crm.dto.TaskCreateRequest;
import com.crm.dto.TaskUpdateRequest;
import com.crm.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public interface TaskService {

    @Async
    CompletableFuture<Page<Task>> findAllTasks(Pageable pageable, String status, String priority,
                                               Long assignedTo, LocalDate fromDate, LocalDate toDate);

    @Async
    CompletableFuture<Optional<Task>> findById(Long id);

    @Async
    CompletableFuture<Task> createTask(TaskCreateRequest request);

    @Async
    CompletableFuture<Task> updateTask(Long id, TaskUpdateRequest request);

    @Async
    CompletableFuture<Task> updateTaskStatus(Long id, TaskStatus status);

    @Async
    CompletableFuture<Void> deleteTask(Long id);

    @Async
    CompletableFuture<List<Task>> findByAssignedTo(Long userId);

    @Async
    CompletableFuture<List<Task>> findByStatus(TaskStatus status);

    @Async
    CompletableFuture<List<Task>> findByPriority(String priority);

    @Async
    CompletableFuture<List<Task>> findOverdueTasks();

    @Async
    CompletableFuture<List<Task>> findTasksDueToday();

    @Async
    CompletableFuture<Object> getTaskStatistics();

    @Async
    CompletableFuture<List<Task>> findTasksDueBetween(LocalDate startDate, LocalDate endDate);
}
