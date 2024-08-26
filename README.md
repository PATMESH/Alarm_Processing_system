# **Alarm Processing System**

## **Overview**

The Alarm Processing System is a comprehensive application for real-time monitoring and management of network devices within a Network Management System (NMS). The system enables administrators to manage users, NMS instances, and devices, while users can monitor assigned NMS, view and resolve alarms, and access alarm history. The system uses Kafka for real-time alarm notifications, ensuring immediate responses to network issues.

## **Features**

- **Admin Panel:**
  - Manage users, NMS instances, and devices.
  - Assign NMS and devices to users.
  
- **User Panel:**
  - View and manage assigned NMS and devices.
  - Resolve alarms and track alarm history.
  - Sort alarms by priority, device, and time.
  
- **Real-Time Monitoring:**
  - Kafka integration for real-time alarm notifications.
  
- **Alarm History:**
  - Track resolved alarms with export options to Excel.

## **Technologies**

- **Frontend:** ReactJS
- **Backend:** Spring Boot
- **Database:** MySQL
- **Real-Time Messaging:** Kafka
- **Development Tools:** VS Code, STS (Spring Tool Suite), Postman, MySQL Workbench, GitHub

## **Architecture**

1. **Presentation Layer (Frontend):**
   - Built with ReactJS for a responsive and modern UI.
   - Utilizes Chart.js for visualizing performance metrics.
   - State management handled by Redux.

2. **Business Logic Layer (Backend):**
   - Developed using Spring Boot.
   - Manages business logic, user authentication, and alarm processing.
   - Role-based access control enforced via Spring Security.

3. **Data Layer:**
   - **Database:** MySQL for storing user data, NMS configurations, devices, and alarm history.
   - **Messaging:** Kafka for real-time alarm notifications between backend and frontend.

## **Setup**

### **Prerequisites**

- Java JDK 11 or later
- Node.js and npm
- MySQL
- Kafka


cd backend
mvn install
mvn spring-boot:run
cd frontend
npm install
npm start

Kafka Setup:

    Ensure Kafka is running and properly configured.



Usage

    Admin Panel: Access via http://localhost:3000/admin to manage users, NMS, and devices.
    User Panel: Access via http://localhost:3000/user to monitor and resolve alarms.
    Real-Time Alerts: Alarms will be displayed instantly due to Kafka integration.
    Alarm History: Access resolved alarms and export data from the history section.

