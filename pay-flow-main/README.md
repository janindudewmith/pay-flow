# PayFlow: Online Voucher Application Portal

PayFlow is a comprehensive payment request management system designed for the Faculty of Engineering, University of Ruhuna. The system streamlines the submission, approval, and tracking of various payment requests for faculty members and administrators.

## Project Overview

PayFlow simplifies the process of managing academic-related payments through a centralized platform. The system offers multiple form types for different payment categories and an approval hierarchy involving department heads, deans, and the financial division. It ensures real-time tracking, notifications, and transparency throughout the request lifecycle.

## Technology Stack

### Frontend

- React.js with functional components and hooks
- Tailwind CSS for responsive and utility-first styling
- Axios for API communication
- React Router for navigation

### Backend

- Node.js with Express.js framework
- MongoDB with Mongoose for NoSQL database management
- dotenv for environment configuration

### Authentication

- Clerk for complete user management and authentication solution

## Features

### Academic Staff (Users)

- Secure login and authentication via Clerk
- Access to multiple payment request forms:
  - Petty Cash Reimbursement
  - Exam Duty Payment
  - Paper Marking Payment
  - Transportation Allowances
  - Overtime Payment
- Form submission with necessary details
- Real-time request tracking and status updates
- Notifications for approvals or corrections

### Financial Division/Department Heads (Admins)

- Dashboard with request overview and status filters
- Multi-level approval workflow (Department Head > Financial Division)
- Rejection with comments and correction requests
- System-wide history of submitted and processed forms

## Installation and Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB instance
- Clerk account for authentication

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend `.env`:**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pay_flow
CLERK_SECRET_KEY=your_clerk_secret_key
```

**Frontend `.env`:**

```
VITE_BACKEND_URL=http://localhost:5000
```

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/pay-flow.git
   cd pay-flow
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. Start the backend server:

   ```bash
   cd ../backend
   npm start
   ```

5. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

## Project Structure

```
pay-flow/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── paymentController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── paymentModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── paymentRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── pdfGenerator.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── README.md
```

## Future Enhancements

- Email notifications for every status change
- Role-based dashboard views
- Exportable reports (PDF, Excel)
- Real-time chat between user and finance division
- Admin analytics dashboard for payment insights

---
