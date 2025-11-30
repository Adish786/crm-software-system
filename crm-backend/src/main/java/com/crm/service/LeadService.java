package com.crm.service;


import com.crm.model.Lead;
import com.crm.enums.LeadStatus;

import java.util.List;
import java.util.Optional;

public interface LeadService {

    /**
     * Retrieve all leads from the database
     * @return List of all leads
     */
    List<Lead> findAll();

    /**
     * Find a lead by its ID
     * @param id the lead ID
     * @return Optional containing the lead if found
     */
    Optional<Lead> findById(Long id);

    /**
     * Save a lead (create or update)
     * @param lead the lead to save
     * @return the saved lead
     */
    Lead save(Lead lead);

    /**
     * Delete a lead by its ID
     * @param id the lead ID to delete
     */
    void deleteById(Long id);

    /**
     * Find leads by their status
     * @param status the lead status to filter by
     * @return List of leads with the specified status
     */
    List<Lead> findByStatus(LeadStatus status);

    /**
     * Find leads assigned to a specific sales representative
     * @param salesRepId the sales representative ID
     * @return List of leads assigned to the sales rep
     */
    List<Lead> findByAssignedSalesRepId(Long salesRepId);

    /**
     * Count leads by status
     * @param status the lead status
     * @return count of leads with the specified status
     */
    Long countByStatus(LeadStatus status);

    /**
     * Convert a lead to a customer
     * @param leadId the lead ID to convert
     * @return the converted customer (you might want to return a Customer object)
     */
    boolean convertToCustomer(Long leadId);

    /**
     * Check if a lead exists by ID
     * @param id the lead ID
     * @return true if lead exists, false otherwise
     */
    boolean existsById(Long id);

    Optional<Lead> updateLead(Long id, Lead leadDetails);

    Optional<Lead> updateStatus(Long id, LeadStatus status);

}
