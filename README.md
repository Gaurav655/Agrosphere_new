# AgroSphere - Farmer Equipment Rental Platform

LIVE DEMO https://agrosphere-farmer.netlify.app/

AgroSphere is a MERN stack application designed to help small farmers rent expensive agricultural equipment (like tractors and harvesters) from equipment owners in their local area.

## Features

- **Farmer Dashboard**: Browse available equipment, selection of rental dates, and booking.
- **Owner Dashboard**: List equipment for rent, manage rental requests (Accept/Reject).
- **Payment Options**: Support for "Pay Now" (Online) and "Pay Later" (Cash on Delivery).
- **Simplicity-First UI**: Designed with large visuals and clear navigation for ease of use.

## Tech Stack

- **Frontend**: React (Vite), CSS (Vanilla), Lucide-React.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **Auth**: JWT (JSON Web Tokens).

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- MongoDB (Local or Atlas) connection URI.

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Agrosphere_new
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   # Create a .env file based on .env.example
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the `server` directory with the following:

- `PORT`: Port number (default 5000)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secret string for authentication
