const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered' });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Registration failed:', err);
  }
});

router.post('/login', async(req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error:'Invalid Credentials'});
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({error: 'Invalid Credentials'});
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.json({token});
});
module.exports = router;