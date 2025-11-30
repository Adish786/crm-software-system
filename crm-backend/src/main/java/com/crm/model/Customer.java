package com.crm.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "customers")
@Schema(description = "Customer entity representing a client in the CRM system")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier of the customer", example = "1")
    private Long id;

    @NotBlank(message = "Name is required")
    @Schema(description = "Full name of the customer", example = "John Doe", required = true)
    private String name;

    @Email(message = "Email should be valid")
    @Schema(description = "Email address of the customer", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Phone number of the customer", example = "+1234567890")
    private String phone;

    @Schema(description = "Company name of the customer", example = "Acme Corporation")
    private String company;

    @Schema(description = "Physical address of the customer", example = "123 Main St, City, Country")
    private String address;

    @Schema(description = "Additional notes about the customer", example = "Important client, prefers email communication")
    private String notes;

    // Constructors
    public Customer() {}

    public Customer(String name, String email, String phone, String company, String address, String notes) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.company = company;
        this.address = address;
        this.notes = notes;
    }

    // Getters and Setters with Schema annotations
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Schema(description = "Full name of the customer", example = "John Doe", required = true)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Schema(description = "Email address of the customer", example = "john.doe@example.com")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Schema(description = "Phone number of the customer", example = "+1234567890")
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @Schema(description = "Company name of the customer", example = "Acme Corporation")
    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    @Schema(description = "Physical address of the customer", example = "123 Main St, City, Country")
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Schema(description = "Additional notes about the customer", example = "Important client, prefers email communication")
    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", company='" + company + '\'' +
                ", address='" + address + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }
}