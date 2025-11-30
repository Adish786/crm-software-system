package com.crm.repository;


import com.crm.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.crm.model.Task;
import com.crm.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    /**
     * Find tasks by assigned user ID
     */
    List<Task> findByAssignedToId(Long assignedToId);

    /**
     * Find tasks by status
     */
    List<Task> findByStatus(TaskStatus status);

    /**
     * Find tasks by priority
     */
    List<Task> findByPriority(String priority);

    /**
     * Find tasks by due date
     */
    List<Task> findByDueDate(LocalDate dueDate);

    /**
     * Find tasks by due date range
     */
    List<Task> findByDueDateBetween(LocalDate startDate, LocalDate endDate);

    /**
     * Count tasks by status
     */
    Long countByStatus(TaskStatus status);

    /**
     * Find overdue tasks (due date before today and status not completed)
     */
    @Query("SELECT t FROM Task t WHERE t.dueDate < :today AND t.status != com.crm.enums.TaskStatus.COMPLETED")
    List<Task> findOverdueTasks(@Param("today") LocalDate today);

    /**
     * Count overdue tasks
     */
    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < :today AND t.status != com.crm.enums.TaskStatus.COMPLETED")
    Long countOverdueTasks(@Param("today") LocalDate today);

    /**
     * Find tasks by status and assigned user
     */
    List<Task> findByStatusAndAssignedToId(TaskStatus status, Long assignedToId);

    /**
     * Find tasks by priority and status
     */
    List<Task> findByPriorityAndStatus(String priority, TaskStatus status);

    /**
     * Find tasks with high priority that are not completed
     */
    @Query("SELECT t FROM Task t WHERE t.priority = 'HIGH' AND t.status != com.crm.enums.TaskStatus.COMPLETED ORDER BY t.dueDate ASC")
    List<Task> findHighPriorityPendingTasks();
}
