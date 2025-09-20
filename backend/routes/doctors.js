const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all doctors
router.get('/', auth, async (req, res) => {
  try {
    const doctors = await User.find({ 
      role: 'doctor', 
      isActive: true 
    }).select('-password');
    
    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const doctor = await User.findOne({ 
      _id: req.params.id, 
      role: 'doctor' 
    }).select('-password');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
