const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const safeJsonParse = (str, fallback = []) => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

// GET /api/buses — public
router.get('/', async (req, res) => {
  try {
    const { from, to } = req.query;
    let query = { isActive: true };

    // Sanitize search inputs — limit length to prevent ReDoS
    if (from && String(from).length <= 100)
      query['route.from'] = { $regex: String(from).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    if (to && String(to).length <= 100)
      query['route.to'] = { $regex: String(to).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };

    const buses = await Bus.find(query).sort({ createdAt: -1 });
    res.json({ success: true, buses });
  } catch (error) {
    console.error('Get buses error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch buses' });
  }
});

// GET /api/buses/admin/all — must be before /:id
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json({ success: true, buses });
  } catch (error) {
    console.error('Admin get buses error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch buses' });
  }
});

// GET /api/buses/:id — public
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });
    res.json({ success: true, bus });
  } catch (error) {
    console.error('Get bus error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch bus' });
  }
});

// POST /api/buses — Admin
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, routeFrom, routeTo, departureTime, arrivalTime, price, totalSeats, amenities, busType } = req.body;

    if (!name || !routeFrom || !routeTo || !departureTime || !arrivalTime || !price) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const busData = {
      name: String(name).slice(0, 200),
      route: { from: String(routeFrom).slice(0, 100), to: String(routeTo).slice(0, 100) },
      departureTime: String(departureTime).slice(0, 20),
      arrivalTime: String(arrivalTime).slice(0, 20),
      price: Math.max(0, Number(price)),
      totalSeats: Math.min(100, Math.max(1, Number(totalSeats) || 40)),
      amenities: amenities ? safeJsonParse(amenities, ['AC']) : ['AC'],
      busType: String(busType || 'AC Sleeper').slice(0, 100)
    };

    if (req.file) busData.image = `/uploads/${req.file.filename}`;

    const bus = await Bus.create(busData);
    res.status(201).json({ success: true, message: 'Bus added successfully', bus });
  } catch (error) {
    console.error('Create bus error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add bus' });
  }
});

// PUT /api/buses/:id — Admin
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, routeFrom, routeTo, departureTime, arrivalTime, price, totalSeats, amenities, busType, isActive } = req.body;

    const updateData = {};
    if (name) updateData.name = String(name).slice(0, 200);
    if (routeFrom || routeTo) {
      const existing = await Bus.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Bus not found' });
      updateData.route = {
        from: routeFrom ? String(routeFrom).slice(0, 100) : existing.route.from,
        to: routeTo ? String(routeTo).slice(0, 100) : existing.route.to
      };
    }
    if (departureTime) updateData.departureTime = String(departureTime).slice(0, 20);
    if (arrivalTime) updateData.arrivalTime = String(arrivalTime).slice(0, 20);
    if (price) updateData.price = Math.max(0, Number(price));
    if (totalSeats) updateData.totalSeats = Math.min(100, Math.max(1, Number(totalSeats)));
    if (amenities) updateData.amenities = safeJsonParse(amenities, ['AC']);
    if (busType) updateData.busType = String(busType).slice(0, 100);
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const bus = await Bus.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });

    res.json({ success: true, message: 'Bus updated successfully', bus });
  } catch (error) {
    console.error('Update bus error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update bus' });
  }
});

// DELETE /api/buses/:id — Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });
    res.json({ success: true, message: 'Bus deleted successfully' });
  } catch (error) {
    console.error('Delete bus error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete bus' });
  }
});

module.exports = router;
