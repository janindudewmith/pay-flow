# Pay-Flow

PayFlow is a comprehensive payment request management system designed for the Faculty of Engineering, University of Ruhuna. This application streamlines the process of submitting, approving, and tracking various payment requests.

## Features

- Multiple payment request forms:
  - Petty Cash Reimbursement
  - Exam Duty Payment
  - Paper Marking Payment
  - Transportation Allowances
  - Overtime Payment
  - and more
- User authentication and authorization
- Form submission and approval workflow
- Dashboard for tracking request status

## Technologies Used

# Frontend:

- React.js: A JavaScript library for building user interfaces
- Tailwind CSS: A utility-first CSS framework for rapid UI development

# Backend:

- Node.js: JavaScript runtime for server-side development
- Express.js: Web application framework for Node.js
- MongoDB: NoSQL database for storing application data

# Authentication:

- Clerk: Complete user management and authentication solution

## Getting Started

### Prerequisites

- React.js
- Tailwind CSS
- Node.js
- Express.js
- npm
- MongoDB

### Installation

1. Clone the repository

   git clone https://github.com/your-username/pay-flow.git

2. Navigate to the project directory

   cd pay-flow

3. Install dependencies

# Install backend dependencies

cd backend
npm install

# Install frontend dependencies

cd ../frontend
npm install

4. Set up environment variables

# In the frontend and backend directories, create .env files

touch .env

# Add the following to the .env file

PORT=5000
MONGODB_URI=mongodb://localhost:27017/pay_flow
CLERK_SECRET_KEY=your_clerk_secret_key

4. Start the development servers

# Start backend server

cd backend
npm start

# In a new terminal, start frontend server

cd frontend
npm run dev

## Project Structure

pay-flow/
├── backend/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── paymentController.js
│ │ └── userController.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ └── errorMiddleware.js
│ ├── models/
│ │ ├── paymentModel.js
│ │ └── userModel.js
│ ├── routes/
│ │ ├── paymentRoutes.js
│ │ └── userRoutes.js
│ ├── utils/
│ │ └── pdfGenerator.js
│ ├── .env
│ ├── package.json
│ └── server.js
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── utils/
│ │ ├── App.js
│ │ └── index.js
│ ├── .env
│ └── package.json
└── README.md
