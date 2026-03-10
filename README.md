# HostelConnect - Complaint Prioritization System

HostelConnect is a responsive, static web application prototype designed to streamline hostel complaint management using a smart prioritization system. It allows students to submit maintenance issues while enabling administrators to manage, track, and resolve them efficiently based on auto-assigned urgency levels.

The project is built entirely as a static frontend using HTML5, CSS3, and JavaScript (ES6). Data persistence is simulated entirely within the browser using `localStorage`.

## 🚀 Features

- **Role-Based Access Control**: Distinct portals and capabilities for Students and Administrators.
- **Smart Prioritization**: Complaints are automatically grouped by detected priority to ensure critical infrastructure issues are addressed first.
- **Data Persistence**: Uses the browser's `localStorage` to save complaints, user profiles, and registrations (data persists securely across sessions until cache is cleared).
- **Responsive Design**: Mobile-ready and completely scalable across all device sizes.
- **Dark/Light Mode**: Built-in theme toggling that remembers your preference.
- **Real-Time Tracking**: Students can see live status updates of their complaints in the student dashboard.

---

## 🏗️ Project Structure

```text
miniiiii/
│
├── index.html                   # Landing page
├── about.html                   # About the platform
├── contact.html                 # Contact details
├── login.html                   # Main login portal (Tabs for Student/Admin)
├── register.html                # Student registration page
├── user-dashboard.html          # Student portal (Submit complaints, view status, edit profile)
├── admin-dashboard.html         # Administrator portal (Manage complaints, validate users, user list)
├── README.md                    # Project documentation
│
└── assets/
    ├── css/
    │   └── style.css            # Global stylesheet, CSS variables, components
    └── js/
        ├── main.js              # Theme toggling, mobile navigation, global utilities
        ├── auth.js              # Login/Register logic utilizing localStorage
        ├── user_dashboard.js    # Logic for rendering Student dashboard and submitting logic
        └── admin_dashboard.js   # Logic for Admin filtering, user validation, and status updates
```

---

## ⚙️ Architecture & Data Logic

### How Storage Works
Since this is a static prototype without a backend server, it heavily leverages `localStorage` to simulate a database. 
Key arrays stringified and stored in your browser:
- `users`: Registered users pending or approved by the admin.
- `complaints`: All submitted tickets, linked to their respective user.
- `currentUser`: The currently authenticated session.

### Authentication Flow
1. **Registration**: Students sign up via `register.html`. Information is saved in localStorage.
2. **Login**: Users authenticate on `login.html`. 
   - **Student Login**: Validates credentials against `localStorage` stored users.
   - **Admin Login**: Uses hardcoded admin credentials.

---

## 🔐 Test Credentials

To preview and test the full capabilities of the system, use the following credentials:

### Student Login
- **Username**: `user`
- **Password**: `user123`

### Admin Login
- **Username**: `admin`
- **Password**: `admin123`

---

## 📖 How to Run & Usage Flow

### Setup
1. Clone or download this project.
2. No server, database, or Node.js installation is required.
3. Simply open `index.html` in any modern web browser (Edge, Chrome, Firefox, Safari).

### Example Workflow
1. **Log in as a Student** using the credentials above (or register a new user).
2. **Submit a Complaint** from the user dashboard. Describe an issue (e.g., "Fan broken", "High Urgency").
3. **Log out** using the navbar logout button.
4. **Log in as an Admin** via the Login page's Admin tab.
5. In the Admin Dashboard, locate the newly submitted complaint.
6. **Update the Status** of the complaint (e.g., change from *Submitted* to *In Progress* or *Resolved*).
7. Optionally, navigate to the **Validate Users** section to approve newly registered user accounts.
8. **Log out** and log back in as the Student. Check the "My Complaints" tab to see the updated status in real-time.

---

*&copy; 2026 HostelConnect. All rights reserved.*
