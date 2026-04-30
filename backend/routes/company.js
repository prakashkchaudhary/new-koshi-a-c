const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
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

// GET /api/company
router.get('/', async (req, res) => {
  try {
    let company = await Company.findOne();
    if (!company) company = await Company.create({});
    res.json({ success: true, company });
  } catch (error) {
    console.error('Get company error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch company info' });
  }
});

// PUT /api/company — Admin only
router.put('/', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    const { name, tagline, description, history, services, routes, experience, established } = req.body;

    let company = await Company.findOne();
    if (!company) company = new Company();

    if (name) company.name = String(name).slice(0, 200);
    if (tagline) company.tagline = String(tagline).slice(0, 300);
    if (description) company.description = String(description).slice(0, 2000);
    if (history) company.history = String(history).slice(0, 2000);
    if (services) company.services = safeJsonParse(services);
    if (routes) company.routes = safeJsonParse(routes);
    if (experience) company.experience = String(experience).slice(0, 100);
    if (established) company.established = String(established).slice(0, 10);

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      company.images = [...(company.images || []), ...newImages].slice(0, 20); // max 20 images
    }

    await company.save();
    res.json({ success: true, message: 'Company details updated', company });
  } catch (error) {
    console.error('Update company error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update company info' });
  }
});

module.exports = router;
