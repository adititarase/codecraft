const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/javalearningapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));

// Java Code Execution Endpoint (safe via Docker)
app.post('/api/run-java', (req, res) => {
  const userCode = req.body.code;
  const timestamp = Date.now().toString();
  const tempDir = path.join(__dirname, 'temp', timestamp);

  // Validate input
  if (typeof userCode !== 'string' || userCode.length > 5000) {
    return res.status(400).json({ success: false, message: "Invalid code input" });
  }

  // Extract class name
  let className = 'Main';
  const classMatch = userCode.match(/public\s+class\s+(\w+)/);
  if (classMatch && classMatch[1]) className = classMatch[1];

  // Create temp directory and save file
  fs.mkdirSync(tempDir, { recursive: true });
  const filePath = path.join(tempDir, `${className}.java`);
  try {
    fs.writeFileSync(filePath, userCode);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to write file" });
  }

  // Docker command to compile and run Java
  const dockerCommand = `
    docker run --rm -v ${tempDir}:/app openjdk:17 bash -c "cd /app && javac ${className}.java && java ${className}"
  `;

  exec(dockerCommand, { timeout: 10000 }, (error, stdout, stderr) => {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
    if (error) return res.json({ success: false, output: stderr || error.message });
    res.json({ success: true, output: stdout });
  });
});

// Fallback Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt via fallback: ${username}`);

  if (username === "Aditi" && password === "password123") {
    console.log("Hardcoded login successful");
    return res.json({ 
      success: true, 
      message: "Login successful",
      username,
      token: "dummy-token-for-testing"
    });
  }

  req.url = '/api/auth/login';
  app._router.handle(req, res);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
