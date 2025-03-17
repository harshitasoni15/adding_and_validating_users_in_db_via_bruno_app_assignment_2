const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect('mongodb+srv://harshitasonis64:abcd1234@cluster0.csawc.mongodb.net/marketplace?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Connection error:', err));

// User Schema (Same as registration)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check for empty fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 4. Successful login
    res.status(200).json({ success: true, message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
