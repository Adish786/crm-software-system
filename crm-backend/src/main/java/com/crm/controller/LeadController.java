package com.crm.controller;

import com.crm.model.Lead;
import com.crm.enums.LeadStatus;
import com.crm.service.LeadService;

import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Leads", description = "Lead management APIs")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    @Operation(summary = "Get all leads")
    public ResponseEntity<List<Lead>> getAllLeads() {
        return ResponseEntity.ok(leadService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get lead by ID")
    public ResponseEntity<Lead> getLeadById(@PathVariable Long id) {
        return leadService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create new lead")
    public ResponseEntity<Lead> createLead(@Valid @RequestBody Lead lead) {
        return ResponseEntity.ok(leadService.save(lead));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update lead")
    public ResponseEntity<Lead> updateLead(
            @PathVariable Long id,
            @Valid @RequestBody Lead leadDetails) {

        return leadService.updateLead(id, leadDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update lead status")
    public ResponseEntity<Lead> updateLeadStatus(
            @PathVariable Long id,
            @RequestParam LeadStatus status) {

        return leadService.updateStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete lead")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        if (!leadService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        leadService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get leads by status")
    public ResponseEntity<List<Lead>> getLeadsByStatus(
            @PathVariable LeadStatus status) {

        return ResponseEntity.ok(leadService.findByStatus(status));
    }
}
