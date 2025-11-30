package com.crm.service;


import com.crm.model.Task;
import com.crm.model.User;
import com.crm.dto.TaskCreateRequest;
import com.crm.dto.TaskUpdateRequest;
import com.crm.enums.TaskStatus;
import com.crm.repository.TaskRepository;
import com.crm.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private static final Logger logger = LoggerFactory.getLogger(TaskServiceImpl.class);

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Async
   // @Async("taskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<Page<Task>> findAllTasks(Pageable pageable, String status, String priority,
                                                      Long assignedTo, LocalDate fromDate, LocalDate toDate) {
        logger.info("Fetching tasks with pagination and filters - Thread: {}", Thread.currentThread().getName());

        Specification<Task> spec = buildTaskSpecification(status, priority, assignedTo, fromDate, toDate);

        return CompletableFuture.completedFuture(taskRepository.findAll(spec, pageable));
    }

    @Override
    @Async
   // @Async("taskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<Optional<Task>> findById(Long id) {
        logger.debug("Fetching task by ID: {} - Thread: {}", id, Thread.currentThread().getName());
        return CompletableFuture.completedFuture(taskRepository.findById(id));
    }

    @Override
    @Async
   // @Async("taskExecutor")
    public CompletableFuture<Task> createTask(TaskCreateRequest request) {
        logger.info("Creating new task - Thread: {}", Thread.currentThread().getName());

        return CompletableFuture.supplyAsync(() -> {
            Task task = new Task();
            task.setTitle(request.getTitle());
            task.setDescription(request.getDescription());
            task.setDueDate(request.getDueDate());
            task.setPriority(request.getPriority());
            task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.PENDING);

            // Assign user if provided
            if (request.getAssignedToId() != null) {
                User assignedUser = userRepository.findById(request.getAssignedToId())
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getAssignedToId()));
                task.setAssignedTo(assignedUser);
            }

            return taskRepository.save(task);
        });
    }

    @Override
    @Async
  //  @Async("taskExecutor")
    public CompletableFuture<Task> updateTask(Long id, TaskUpdateRequest request) {
        logger.info("Updating task with ID: {} - Thread: {}", id, Thread.currentThread().getName());

        return CompletableFuture.supplyAsync(() -> {
            Task task = taskRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

            // Update fields if provided
            if (request.getTitle() != null) {
                task.setTitle(request.getTitle());
            }
            if (request.getDescription() != null) {
                task.setDescription(request.getDescription());
            }
            if (request.getDueDate() != null) {
                task.setDueDate(request.getDueDate());
            }
            if (request.getPriority() != null) {
                task.setPriority(request.getPriority());
            }
            if (request.getStatus() != null) {
                task.setStatus(request.getStatus());
            }
            if (request.getAssignedToId() != null) {
                User assignedUser = userRepository.findById(request.getAssignedToId())
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getAssignedToId()));
                task.setAssignedTo(assignedUser);
            }

            return taskRepository.save(task);
        });
    }

    @Override
    @Async
   // @Async("taskExecutor")
    public CompletableFuture<Task> updateTaskStatus(Long id, TaskStatus status) {
        logger.info("Updating task status for ID: {} to {} - Thread: {}", id, status, Thread.currentThread().getName());

        return CompletableFuture.supplyAsync(() -> {
            Task task = taskRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

            task.setStatus(status);
            return taskRepository.save(task);
        });
    }

    @Override
    @Async
    //@Async("taskExecutor")
    public CompletableFuture<Void> deleteTask(Long id) {
        logger.info("Deleting task with ID: {} - Thread: {}", id, Thread.currentThread().getName());

        return CompletableFuture.runAsync(() -> {
            if (!taskRepository.existsById(id)) {
                throw new RuntimeException("Task not found with id: " + id);
            }
            taskRepository.deleteById(id);
        });
    }

    @Override
    @Async
  //  @Async("taskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<List<Task>> findByAssignedTo(Long userId) {
        logger.debug("Fetching tasks for user ID: {} - Thread: {}", userId, Thread.currentThread().getName());

        return CompletableFuture.supplyAsync(() -> {
            if (!userRepository.existsById(userId)) {
                throw new RuntimeException("User not found with id: " + userId);
            }
            return taskRepository.findByAssignedToId(userId);
        });
    }

    @Override
    @Async
   // @Async("taskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<List<Task>> findByStatus(TaskStatus status) {
        return CompletableFuture.supplyAsync(() -> taskRepository.findByStatus(status));
    }

    @Override
    @Async
   // @Async("taskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<List<Task>> findByPriority(String priority) {
        return CompletableFuture.supplyAsync(() -> taskRepository.findByPriority(priority));
    }

    @Override
    @Async
   // @Async("taskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<List<Task>> findOverdueTasks() {
        return CompletableFuture.supplyAsync(() -> taskRepository.findOverdueTasks(LocalDate.now()));
    }

    @Override
    @Async
   // @Async("taskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<List<Task>> findTasksDueToday() {
        return CompletableFuture.supplyAsync(() -> taskRepository.findByDueDate(LocalDate.now()));
    }

    @Override
    @Async
   // @Async("taskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<Object> getTaskStatistics() {
        logger.info("Calculating task statistics - Thread: {}", Thread.currentThread().getName());
        return CompletableFuture.supplyAsync(() -> {
            Map<String, Object> stats = new ConcurrentHashMap<>();
            Long totalTasks = taskRepository.count();
            Long completedTasks = taskRepository.countByStatus(TaskStatus.COMPLETED);
            Long overdueTasks = taskRepository.countOverdueTasks(LocalDate.now());
            Long pendingTasks = taskRepository.countByStatus(TaskStatus.PENDING);
            stats.put("totalTasks", totalTasks);
            stats.put("completedTasks", completedTasks);
            stats.put("overdueTasks", overdueTasks);
            stats.put("pendingTasks", pendingTasks);
            stats.put("completionRate", totalTasks > 0 ? (double) completedTasks / totalTasks * 100 : 0);
            return stats;
        });
    }

    @Override
    @Async
   // @Async("taskExecutor")
    @Transactional(readOnly = true)
    public CompletableFuture<List<Task>> findTasksDueBetween(LocalDate startDate, LocalDate endDate) {
        return CompletableFuture.supplyAsync(() ->
                taskRepository.findByDueDateBetween(startDate, endDate));
    }

    /**
     * Builds dynamic specification for filtering tasks
     */
    private Specification<Task> buildTaskSpecification(String status, String priority, Long assignedTo,
                                                       LocalDate fromDate, LocalDate toDate) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null && !status.isEmpty()) {
                try {
                    TaskStatus taskStatus = TaskStatus.valueOf(status.toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("status"), taskStatus));
                } catch (IllegalArgumentException e) {
                    logger.warn("Invalid task status provided: {}", status);
                }
            }

            if (priority != null && !priority.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("priority"), priority.toUpperCase()));
            }

            if (assignedTo != null) {
                predicates.add(criteriaBuilder.equal(root.get("assignedTo").get("id"), assignedTo));
            }

            if (fromDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("dueDate"), fromDate));
            }

            if (toDate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("dueDate"), toDate));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}