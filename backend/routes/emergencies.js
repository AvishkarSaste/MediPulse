const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Mock emergency data for now
let emergencies = [
  {
    id: 1,
    patientId: 'patient1',
    patientName: 'John Doe',
    emergencyType: 'Cardiac',
    severity: 'High',
    location: '123 Main St, City',
    status: 'Active',
    createdAt: new Date(),
    assignedDoctor: null
  }
];

// Get all emergencies
router.get('/', auth, async (req, res) => {
  try {
    if (!['admin', 'doctor'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(emergencies);
  } catch (error) {
    console.error('Get emergencies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create emergency
router.post('/', auth, async (req, res) => {
  try {
    const { emergencyType, severity, location, description } = req.body;
    
    const emergency = {
      id: emergencies.length + 1,
      patientId: req.user.userId,
      patientName: req.user.name,
      emergencyType,
      severity,
      location,
      description,
      status: 'Active',
      createdAt: new Date(),
      assignedDoctor: null
    };

    emergencies.push(emergency);
    res.status(201).json(emergency);
  } catch (error) {
    console.error('Create emergency error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update emergency status
router.put('/:id', auth, async (req, res) => {
  try {
    if (!['admin', 'doctor'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, assignedDoctor } = req.body;
    const emergency = emergencies.find(e => e.id == req.params.id);
    
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    emergency.status = status || emergency.status;
    emergency.assignedDoctor = assignedDoctor || emergency.assignedDoctor;

    res.json(emergency);
  } catch (error) {
    console.error('Update emergency error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
