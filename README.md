# **Login and Registration System**

A simple and efficient full-stack login and registration system built with **React**, **Express.js**, and **MongoDB**.

## Live Demo  
https://react-express-login.onrender.com    


---

## **Table of Contents**
1. [About the Project](#about-the-project)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
5. [Usage](#usage)
6. [License](#license)
7. [Contact](#contact)

---

## **About the Project**

This project provides a secure authentication system:
- A React-based frontend for user interaction.
- An Express.js backend with all routes defined in `server.js`.
- MongoDB for data storage, ensuring scalability.
- Security features like password encryption with `bcrypt` and input sanitization using `sanitize-html`.

---

## **Features**

- 🔒 Password encryption with `bcrypt`
- 🛡️ Input sanitization to prevent XSS attacks
- 📂 Session management with `express-sessions`
- 🌐 RESTful API for authentication
- 📊 MongoDB for data storage

---

## **Tech Stack**

### Frontend:
- React.js
- Axios (for HTTP requests)

### Backend:
- Node.js
- Express.js
- MongoDB (native driver)
- bcrypt (for password hashing)
- sanitize-html (for input sanitization)
- express-sessions (for session management)

---

## **Getting Started**

### Prerequisites

Ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (running locally or via a cloud service like MongoDB Atlas)

### Installation

1. Clone the repository:
git clone https://github.com/owpji/react-express-login-system.git  
cd react-express-login-system


2. Install dependencies:  
npm install


3. Configure environment variables:
- Create a `.env` file in the backend folder with the following variables:
  ```
  MONGO_URI=YOUR-MONGODB-URL  
  SESSION_SECRET=YOUR-SESSION-SECRET
  ```

4. Start the application:  
cd backend  
npm start  
  
new terminal  
npm start


5. Open your browser and navigate to `http://localhost:5173`.

## **Deployment**

The project deploys as two services: the React frontend on Vercel and the Express API on Render. MongoDB Atlas is used for users and persistent sessions.

### 1. Create a MongoDB Atlas database

Create a free Atlas cluster and database user, then allow network access from Render (Atlas `0.0.0.0/0` is the simplest option for Render's changing outbound IPs; use a strong database password). Copy the application's connection string, replacing the username and password. Add the database name `login-system` to the URI if it is not already present.

### 2. Deploy the API to Render

Create a Render Web Service from the GitHub repository and use the included `render.yaml` blueprint. It configures the `backend` root directory, install/start commands, health check, and production session secret. Provide `MONGO_URI` when prompted. After the first deploy, copy the service URL (for example, `https://your-api.onrender.com`).

### 3. Deploy the frontend to Vercel

Import the same GitHub repository into Vercel. Keep the project root at the repository root and use:

- Build command: `npm run build`
- Output directory: `dist`

Set the `VITE_API_URL` environment variable to the Render service URL (no trailing slash), then deploy. Copy the production Vercel URL.

### 4. Connect the services

In the Render service's environment settings, set `FRONTEND_URL` to the production Vercel URL (for example, `https://your-app.vercel.app`) and redeploy. The frontend and API require credentialed requests so login sessions can use secure cookies.

Never commit `.env` files or paste secrets into source code. Use `.env.example` and `backend/.env.example` as local templates; enter production values only in the Render and Vercel dashboards.

---

## **Usage**

### Registration:
1. Access the registration page.
2. Enter your details (name, email, password).
3. Submit the form to create an account.

### Login:
1. Access the login page.
2. Enter your credentials.
3. Upon successful login, access protected routes or features.

---  

## **License**

This project is licensed under the MIT License.

---

## **Contact**

For questions or feedback, feel free to reach out:

**Peter Isaac**  
- Linkedin: [https://www.linkedin.com/in/peter-joseph-isaac](https://www.linkedin.com/in/peter-joseph-isaac)
- GitHub: [https://github.com/peter-joseph-isaac](https://github.com/peter-joseph-isaac)
