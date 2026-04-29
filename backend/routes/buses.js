const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/buses - Get all active buses
router.get('/', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    let query = { isActive: true };

    if (from) query['route.from'] = { $regex: from, $options: 'i' };
    if (to) query['route.to'] = { $regex: to, $options: 'i' };

    const buses = await Bus.find(query).sort({ createdAt: -1 });
    res.json({ success: true, buses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/buses/:id - Get single bus
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }
    res.json({ success: true, bus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/buses - Admin: Add new bus
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const {
      name, routeFrom, routeTo, departureTime, arrivalTime,
      price, totalSeats, amenities, busType
    } = req.body;

    const busData = {
      name,
      route: { from: routeFrom, to: routeTo },
      departureTime,
      arrivalTime,
      price: Number(price),
      totalSeats: Number(totalSeats) || 40,
      amenities: amenities ? JSON.parse(amenities) : ['AC', 'WiFi'],
      busType: busType || 'AC Sleeper'
    };

    if (req.file) {
      busData.image = `/uploads/${req.file.filename}`;
    }

    const bus = await Bus.create(busData);
    res.status(201).json({ success: true, message: 'Bus added successfully', bus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/buses/:id - Admin: Update bus
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const {
      name, routeFrom, routeTo, departureTime, arrivalTime,
      price, totalSeats, amenities, busType, isActive
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (routeFrom || routeTo) {
      const bus = await Bus.findById(req.params.id);
      updateData.route = {
        from: routeFrom || bus.route.from,
        to: routeTo || bus.route.to
      };
    }
    if (departureTime) updateData.departureTime = departureTime;
    if (arrivalTime) updateData.arrivalTime = arrivalTime;
    if (price) updateData.price = Number(price);
    if (totalSeats) updateData.totalSeats = Number(totalSeats);
    if (amenities) updateData.amenities = JSON.parse(amenities);
    if (busType) updateData.busType = busType;
    if (isActive !== undefined) updateData.isActive = isActive === 'true';
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const bus = await Bus.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    res.json({ success: true, message: 'Bus updated successfully', bus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/buses/:id - Admin: Delete bus
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }
    res.json({ success: true, message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/buses/admin/all - Admin: Get all buses including inactive
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json({ success: true, buses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
