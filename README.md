💬 Real-Time Chat App
A real-time full-stack chat application built using the MERN stack and Socket.IO.
Send and receive messages instantly, see who’s online, and manage your profile — all in a sleek and responsive interface.

🔗 Live Demo: real-time-chat-frontend-one.vercel.app

🚀 Tech Stack
Frontend: React + TypeScript + Vite + TailwindCSS

Backend: Express.js + MongoDB + JWT Auth

Real-Time: Socket.IO

Deployment: Vercel (Frontend) & Render (Backend)

📸 Features
✅ Authentication (Login / Signup)
✅ Realtime Messaging (via WebSockets)
✅ Online Users List
✅ Update Profile & Bio
✅ Responsive Design
✅ JWT-based Auth
✅ Error handling & Toast Notifications
✅ MongoDB Atlas Integration

📁 Folder Structure
bash
Copy
Edit
RealTimeChat/
│
├── frontend/        # React + Vite client
│   └── src/
│       ├── Components/
│       ├── Context/          # Auth and Chat Contexts
│       ├── Pages/
│       └── ...
│
├── backend/         # Express API
│   ├── Routes/
│   ├── Controllers/
│   ├── Middleware/
│   ├── Config/       # MongoDB connection
│   └── index.js      # Main server + Socket.IO setup
🧑‍💻 Getting Started Locally
Make sure MongoDB is running locally or update your .env to use MongoDB Atlas.

1. Clone the Repo
bash
Copy
Edit
git clone https://github.com/Ajay-Chaudharyyy/RealTimeChat.git
cd RealTimeChat
2. Backend Setup
bash
Copy
Edit
cd backend
npm install
# Create .env with MONGO_URI, JWT_SECRET, CLOUDINARY credentials, etc.
npm run server
3. Frontend Setup
bash
Copy
Edit
cd ../frontend
npm install
# Create .env with VITE_BACKEND_URL
npm run dev
🌐 Deployment
Frontend → Vercel
Deployed at: https://real-time-chat-frontend-one.vercel.app/

Vite + React + TailwindCSS

Backend → Render
Deployed at: https://realtimechat-2-lbeu.onrender.com

CORS configured to allow frontend domain

🤝 Acknowledgements
React, Vite & TypeScript Docs

Socket.IO Docs

MongoDB Atlas

Render & Vercel deployment guides

react-toastify for UI alerts

📬 Contact
Ajay Chaudhary
📧 ajaychaudharyy4308@gmail.com
🌐 LinkedIn (add your link if public)

⭐️ Star the Repo
If this project helped you learn something new or saved you time, consider giving it a ⭐️ on GitHub :)
