package com.crm.controller;

import com.crm.model.Customer;
import com.crm.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Customers", description = "Customer management APIs")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Operation(
            summary = "Get all customers",
            description = "Retrieves a list of all customers in the system"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved all customers",
                    content = @Content(schema = @Schema(implementation = Customer.class, type = "array"))
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.findAll();
    }

    @Operation(
            summary = "Get customer by ID",
            description = "Retrieves a specific customer by their unique identifier"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Customer found successfully",
                    content = @Content(schema = @Schema(implementation = Customer.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Customer not found",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(
            @Parameter(description = "Customer ID", example = "1", required = true)
            @PathVariable Long id) {
        Optional<Customer> customer = customerService.findById(id);
        return customer.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Create a new customer",
            description = "Creates a new customer with the provided details"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Customer created successfully",
                    content = @Content(schema = @Schema(implementation = Customer.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid customer data provided",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public Customer createCustomer(
            @Parameter(description = "Customer object to create", required = true)
            @RequestBody Customer customer) {
        return customerService.save(customer);
    }

    @Operation(
            summary = "Update customer",
            description = "Updates an existing customer's information"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Customer updated successfully",
                    content = @Content(schema = @Schema(implementation = Customer.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Customer not found",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(
            @Parameter(description = "Customer ID", example = "1", required = true)
            @PathVariable Long id,
            @Parameter(description = "Updated customer data", required = true)
            @RequestBody Customer customerDetails) {
        Optional<Customer> customer = customerService.findById(id);
        if (customer.isPresent()) {
            Customer existingCustomer = customer.get();
            existingCustomer.setName(customerDetails.getName());
            existingCustomer.setEmail(customerDetails.getEmail());
            existingCustomer.setPhone(customerDetails.getPhone());
            existingCustomer.setCompany(customerDetails.getCompany());
            existingCustomer.setAddress(customerDetails.getAddress());
            existingCustomer.setNotes(customerDetails.getNotes());
            return ResponseEntity.ok(customerService.save(existingCustomer));
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(
            summary = "Delete customer",
            description = "Deletes a customer from the system"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Customer deleted successfully"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Customer not found",
                    content = @Content
            )
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(
            @Parameter(description = "Customer ID", example = "1", required = true)
            @PathVariable Long id) {
        if (customerService.findById(id).isPresent()) {
            customerService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}