🏢 CRM Software System
CRM Software System
Customer Relationship Management system for managing customer interactions and business relationships.

🚀 Features
Contact Management - Centralized customer database

Lead Tracking - Sales pipeline management

Task Management - Activity and follow-up tracking

Reporting Dashboard - Business intelligence insights

Email Integration - Communication history

Document Management - Contract and proposal storage

🛠️ Tech Stack
Backend
Spring Boot 6

JDK 21

Spring Security

Spring Data JPA

MySQL

Spring Mail

Frontend
React 18

Vite

TypeScript

Ant Design

Chart.js

⚙️ Quick Setup
Backend
bash
cd crm-software-system/backend

# Setup database
mysql -u root -p -e "CREATE DATABASE crm_system;"

# Run application
./mvnw spring-boot:run
Frontend
bash
cd ../frontend
npm install
npm run dev
🔧 Configuration
Update application.properties:

properties
spring.datasource.url=jdbc:mysql://localhost:3306/crm_system
spring.mail.host=smtp.gmail.com
spring.mail.port=587
👥 User Roles
ADMIN - Full system access

SALES_MANAGER - Team and lead management

SALES_AGENT - Contact and opportunity management

CUSTOMER_SUPPORT - Ticket management
