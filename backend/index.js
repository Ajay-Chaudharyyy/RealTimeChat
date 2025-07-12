const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config(); // Load .env early

// Middleware
app.use(cors()); // ✅ call the function
app.use(express.json({ limit: "10mb" })); // or even higher if needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));


// HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict to specific frontend domain
    methods: ["GET", "POST"]
  }
});

// Export io for other files
exports.io = io;

// Online users map: userId → socketId
const userSocketMap = {};
exports.userSocketMap = userSocketMap;

// Socket connection handling
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers",Object.keys(userSocketMap));

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
  });
});

// Routes
const router = require("./Routes/UserRoutes");
app.use("/api/v1", router);

// Health check route
app.get("/api/status", (req, res) => {
  res.send("<h1>Server is live</h1>");
});

// Connect to MongoDB
const db = require("./Config/database");
db();

// Start server
if(process.env.NODE_ENV !== "production")
{
  const port = process.env.PORT || 8080;
server.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);
}

module.exports = server