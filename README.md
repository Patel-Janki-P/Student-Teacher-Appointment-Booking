# 📚 Student-Teacher Appointment Booking

This is a web application that allows students to book appointments with teachers. The app supports role-based access for **Admin**, **Teacher**, and **Student**.

---

## 🔧 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS  
- **Backend/Database:** Firebase Firestore + Firebase Authentication

---

## 🔑 Features

### 👤 Role-Based Access

#### 🛠️ Admin
- Approve new teacher registrations
- View all registered teachers
- View all upcoming appointments grouped by teacher

#### 👨‍🏫 Teacher
- Register and await admin approval
- Approve or reject student appointment requests
- View messages and upcoming appointments from students

#### 👩‍🎓 Student
- Register by selecting a teacher
- Await approval from the selected teacher
- Book appointments after approval
- Send messages to their teacher

---

## 📁 Folder Structure


- src/
  - ├── components/
  - ├── pages/
  - │ ├── Login.jsx
  - │ ├── SignUp.jsx
  - │ ├── StudentDashboard.jsx
  - │ ├── TeacherDashboard.jsx
  - │ ├── AdminDashboard.jsx
  - ├── context/
  - │ └── AuthContext.jsx
  - ├── firebase/
  - │ └── config.js
  - └── App.jsx

## 🧪 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Patel-Janki-P/Student-Teacher-Appointment-Booking.git
cd appointment-booking
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Firebase
  - Go to Firebase Console
  - Create a project
  - Enable Authentication (Email/Password)
  - Setup Firestore Database
  - Copy your Firebase config and paste it inside /src/firebase/firebase.js
    
  ```import { initializeApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore";
  import { getAuth } from "firebase/auth";
  
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  export const auth = getAuth(app);
```
  
## Run the app

```bash
npm run dev
```

---

## Firestore Collections
- **users**
  - Fields:
      - fullName,
      - email,
      - department,
      - role (student | teacher),
      - approved,
      - teacherId (if student)

- **appointments**
  - Fields:
    - studentId,
    - studentName,
    - studentEmail,
    - department,
    - teacherId,
    - time (as string)

- **messages**
  - Fields:
      - studentId,
      - teacherId,
      - message,
      - timestamp
   
## Snapshots
- **Landing Page**(Choose Role):
  ![Screenshot 2025-05-26 221043](https://github.com/user-attachments/assets/78f0364b-fb42-455d-942f-7a95c1d62d97)

- **Student Dashboard:**
  - Student Log-in Page:
  ![Screenshot 2025-05-26 221232](https://github.com/user-attachments/assets/9d9ef3fc-e959-4d92-803a-071b37c2bf1b)
  - Student Sign-up Page
  ![Screenshot 2025-05-26 221446](https://github.com/user-attachments/assets/f5a0293b-1d61-4355-8599-43cdaaa26c92)
  - Student Dashboard:
  ![Screenshot 2025-05-26 221116](https://github.com/user-attachments/assets/c41502e2-bd79-4bda-b8e9-ae01e8f2ced6)

- **Teacher Dashboard:**
  - Teacher Log-in Page:
  ![Screenshot 2025-05-26 222132](https://github.com/user-attachments/assets/ebf3daff-fe9b-41b0-b816-1de2dccf7671)
  - Teacher Sign-up Page:
  ![Screenshot 2025-05-26 221342](https://github.com/user-attachments/assets/0cf57e77-a830-4c37-8f3c-7ff167d82413)
  - Teacher Dashboard: 
  ![Screenshot 2025-05-26 224911](https://github.com/user-attachments/assets/dbe46636-60f1-4ccd-9599-b11dc6b16c4c)


- **Admin Dashboard:**
  - Admin Log-in Page:
  ![Screenshot 2025-05-26 222204](https://github.com/user-attachments/assets/67535387-16db-47fd-9b8a-cbd333a1651a)
  - Admin Dashboard: 
  ![Screenshot 2025-05-26 224944](https://github.com/user-attachments/assets/2491b5c8-9c02-428b-892c-985056cbb6a4)

  

## 📝 Notes
- Students are approved by their selected teacher
- Appointments show in both Teacher and Admin dashboards
- Time is stored as a string for simpler formatting
- Data is displayed in table format for clarity

## 🧑‍💻 Author
Developed by JANKI PATEL.


