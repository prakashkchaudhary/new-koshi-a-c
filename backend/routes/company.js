const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/company - Get company details
router.get('/', async (req, res) => {
  try {
    let company = await Company.findOne();
    if (!company) {
      company = await Company.create({});
    }
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/company - Admin: Update company details
router.put('/', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    const { name, tagline, description, history, services, routes, experience, established } = req.body;

    let company = await Company.findOne();
    if (!company) {
      company = new Company();
    }

    if (name) company.name = name;
    if (tagline) company.tagline = tagline;
    if (description) company.description = description;
    if (history) company.history = history;
    if (services) company.services = JSON.parse(services);
    if (routes) company.routes = JSON.parse(routes);
    if (experience) company.experience = experience;
    if (established) company.established = established;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      company.images = [...company.images, ...newImages];
    }

    await company.save();
    res.json({ success: true, message: 'Company details updated', company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
