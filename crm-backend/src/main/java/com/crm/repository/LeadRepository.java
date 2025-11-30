package com.crm.repository;

import com.crm.model.Lead;
import com.crm.enums.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    /**
     * Find leads by status
     */
    List<Lead> findByStatus(LeadStatus status);

    /**
     * Find leads assigned to a specific sales representative
     */
    List<Lead> findByAssignedSalesRepId(Long assignedSalesRepId);

    /**
     * Count leads by status
     */
    Long countByStatus(LeadStatus status);

    /**
     * Find leads by source
     */
    List<Lead> findBySource(String source);

    /**
     * Find leads by name containing (case-insensitive)
     */
    List<Lead> findByNameContainingIgnoreCase(String name);

    /**
     * Find leads by contact info containing (case-insensitive)
     */
    List<Lead> findByContactInfoContainingIgnoreCase(String contactInfo);

    /**
     * Check if lead exists by name and contact info
     */
    boolean existsByNameAndContactInfo(String name, String contactInfo);

    /**
     * Find leads by multiple statuses
     */
    List<Lead> findByStatusIn(List<LeadStatus> statuses);

    /**
     * Find leads needing follow-up (NEW or CONTACTED status)
     */
    default List<Lead> findLeadsNeedingFollowUp() {
        return findByStatusIn(List.of(LeadStatus.NEW, LeadStatus.CONTACTED));
    }

    /**
     * Count leads by sales representative and status
     */
    @Query("SELECT COUNT(l) FROM Lead l WHERE l.assignedSalesRep.id = :salesRepId AND l.status = :status")
    Long countByAssignedSalesRepIdAndStatus(@Param("salesRepId") Long salesRepId, @Param("status") LeadStatus status);

    /**
     * Find leads by sales representative and status
     */
    List<Lead> findByAssignedSalesRepIdAndStatus(Long assignedSalesRepId, LeadStatus status);
}