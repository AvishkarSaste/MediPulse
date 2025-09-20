const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all patients (admin and doctor only)
router.get('/', auth, async (req, res) => {
  try {
    if (!['admin', 'doctor'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patients = await User.find({ 
      role: 'patient', 
      isActive: true 
    }).select('-password');
    
    res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient by ID
router.get('/:id', auth, async (req, res) => {
  try {
    if (!['admin', 'doctor'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await User.findOne({ 
      _id: req.params.id, 
      role: 'patient' 
    }).select('-password');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search patients
router.get('/search/:query', auth, async (req, res) => {
  try {
    if (!['admin', 'doctor'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const query = req.params.query;
    const patients = await User.find({
      role: 'patient',
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('-password');

    res.json(patients);
  } catch (error) {
    console.error('Search patients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
