# mobiz-cart application

The Mobiz application is a full-stack web application built using React, Redux, Tailwind CSS for the frontend, and Node.js with Express for the backend. It includes JWT-based authentication for user authentication and authorization.

#Features
User authentication and authorization using JWT.
Frontend developed using React and Redux for state management.
Responsive UI design using Tailwind CSS.
Backend API built with Node.js and Express.
User-friendly pagination for displaying products.
CRUD operations for products.
Adding products to the cart.
Getting Started
Follow the steps below to get the Mobiz application up and running on your local machine.

#Prerequisites
Node.js and npm should be installed on your machine.
Frontend Setup
Open a terminal and navigate to the client directory.

cd client
Install the required dependencies.

npm install
Start the frontend development server.

npm start

The frontend should be accessible at http://localhost:3000.

Backend Setup

Open a new terminal window and navigate to the server directory.

cd server

npm install

Generate a JWT secret key.

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

Copy the generated key and paste it into the .env file as JWT_SECRET.

Start the backend server.

npm start
