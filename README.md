<img width="1561" height="617" alt="{EB95B491-F17F-4854-BFE7-0737D7E4A18E}" src="https://github.com/user-attachments/assets/0a126678-5c0c-4705-9128-1bdc52ac5934" />
# 🎓 College Grievance and Resolution Management System

A complete **Full Stack Web Application** designed to digitally manage student grievances in colleges.
This system helps students submit grievances online and allows administrators to track, prioritize, and resolve them efficiently.


## 📖 Project Description

The **College Grievance and Resolution Management System** is developed to replace the traditional manual grievance process with a digital, transparent, and efficient platform.

Students can submit complaints related to academics, infrastructure, or administration.
Admins can review grievances, update status, provide responses, and ensure timely resolution.

The system improves accountability, reduces paperwork, and provides analytical insights into grievance handling.


##  Objectives of the Project

* To provide an online platform for students to raise grievances
* To ensure transparency in grievance resolution
* To reduce manual paperwork and delays
* To track grievance status in real time
* To help administrators prioritize and resolve issues efficiently


##  Features

###  Student Module

* Student registration and login
* Raise grievances with title, description, category, and priority
* Upload images as proof
* Speech-to-text support for grievance submission
* Track grievance status (Pending / In Progress / Resolved)
* Receive email notifications
* Provide feedback and rating after resolution

###  Admin Module

* Admin login
* View all grievances in a dashboard
* Assign priority and deadlines
* Update grievance status
* Respond with resolution remarks
* View analytics of resolved and pending grievances


## Technology Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL
* Database Name: **`grivup`**

### Tools & Platforms

* Git & GitHub
* REST APIs
* MySQL Server


## 🗄️ Database Design

The system uses a MySQL database named **`grivup`**.

### Tables Used

* **students**
  Stores student information such as name, email, class, and credentials.

* **admins**
  Stores admin login and role details.

* **classes**
  Stores class or department details.

* **grievances**
  Stores grievance title, description, category, priority, and submission date.

* **grievance_status**
  Tracks the status of each grievance.

* **responses**
  Stores admin responses and resolution comments.

### Relationships

* One student can raise multiple grievances
* Each grievance belongs to one student
* Each grievance is handled by an admin
* Status and responses are linked using grievance ID


## 🔄 System Workflow

The system flow diagram explains how data moves through the application from grievance submission to resolution.

### Flow Description

1. Student logs into the system
2. Student submits a grievance
3. Grievance data is stored in MySQL database
4. Admin views grievances via dashboard
5. Admin updates grievance status and provides response
6. Student receives notification
7. Student gives feedback after resolution


## 📂 Project Structure

```
college-grievance-portal/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── database/
│   └── Dump20250106.sql
│
└── README.md
```

---

## ⚙️ Installation and Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/college-grievance-portal.git
cd college-grievance-portal
```

### Step 2: Backend Setup

```bash
cd backend
npm install
npm start
```

### Step 3: Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Step 4: Database Setup

```sql
CREATE DATABASE grivup;
```

Import the SQL file:

```bash
mysql -u root -p grivup < Dump20250106.sql
```

---

## 🔐 Environment Variables

Create a `.env` file in backend folder:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=grivup
PORT=5000
```

## 📌 Future Enhancements

* Mobile application
* SMS notifications
* Role-based access control
* AI-based grievance categorization
* Cloud deployment


## 📄 License

This project is developed for academic and learning purposes.


Just tell me 👍
