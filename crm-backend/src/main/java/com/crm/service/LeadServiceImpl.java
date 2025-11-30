package com.crm.service.impl;

import com.crm.enums.LeadStatus;
import com.crm.model.Lead;
import com.crm.repository.LeadRepository;
import com.crm.service.LeadService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;

    public LeadServiceImpl(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    @Override
    public List<Lead> findAll() {
        return leadRepository.findAll();
    }

    @Override
    public Optional<Lead> findById(Long id) {
        return leadRepository.findById(id);
    }

    @Override
    public Lead save(Lead lead) {
        return leadRepository.save(lead);
    }

    @Override
    public void deleteById(Long id) {
        leadRepository.deleteById(id);
    }

    @Override
    public List<Lead> findByStatus(LeadStatus status) {
        return leadRepository.findByStatus(status);
    }

    @Override
    public List<Lead> findByAssignedSalesRepId(Long salesRepId) {
        return leadRepository.findByAssignedSalesRepId(salesRepId);
    }

    @Override
    public Long countByStatus(LeadStatus status) {
        return leadRepository.countByStatus(status);
    }

    @Override
    public boolean convertToCustomer(Long leadId) {
        Optional<Lead> optional = leadRepository.findById(leadId);

        if (optional.isEmpty()) {
            return false;
        }

        Lead lead = optional.get();
        lead.setStatus(LeadStatus.CONVERTED);
        leadRepository.save(lead);

        return true;
    }

    @Override
    public boolean existsById(Long id) {
        return leadRepository.existsById(id);
    }



    @Override
    public Optional<Lead> updateLead(Long id, Lead leadDetails) {
        return leadRepository.findById(id).map(existingLead -> {
            existingLead.setName(leadDetails.getName());
            existingLead.setContactInfo(leadDetails.getContactInfo());
            existingLead.setSource(leadDetails.getSource());
            existingLead.setStatus(leadDetails.getStatus());
            existingLead.setAssignedSalesRep(leadDetails.getAssignedSalesRep());
            return leadRepository.save(existingLead);
        });
    }

    @Override
    public Optional<Lead> updateStatus(Long id, LeadStatus status) {
        return leadRepository.findById(id).map(lead -> {
            lead.setStatus(status);
            return leadRepository.save(lead);
        });
    }

    public LeadStatistics getLeadStatistics() {
        Long totalLeads = leadRepository.count();
        Long newLeads = leadRepository.countByStatus(LeadStatus.NEW);
        Long contactedLeads = leadRepository.countByStatus(LeadStatus.CONTACTED);
        Long convertedLeads = leadRepository.countByStatus(LeadStatus.CONVERTED);

        // Get leads needing follow-up (using the fixed method)
        List<Lead> leadsNeedingFollowUp = leadRepository.findLeadsNeedingFollowUp();

        return new LeadStatistics(totalLeads, newLeads, contactedLeads, convertedLeads, (long) leadsNeedingFollowUp.size());
    }

    // Update LeadStatistics class to include follow-up count:
    public static class LeadStatistics {
        private final Long totalLeads;
        private final Long newLeads;
        private final Long contactedLeads;
        private final Long convertedLeads;
        private final Long leadsNeedingFollowUp;

        public LeadStatistics(Long totalLeads, Long newLeads, Long contactedLeads, Long convertedLeads, Long leadsNeedingFollowUp) {
            this.totalLeads = totalLeads;
            this.newLeads = newLeads;
            this.contactedLeads = contactedLeads;
            this.convertedLeads = convertedLeads;
            this.leadsNeedingFollowUp = leadsNeedingFollowUp;
        }

        // Getters
        public Long getTotalLeads() { return totalLeads; }
        public Long getNewLeads() { return newLeads; }
        public Long getContactedLeads() { return contactedLeads; }
        public Long getConvertedLeads() { return convertedLeads; }
        public Long getLeadsNeedingFollowUp() { return leadsNeedingFollowUp; }
    }

}
