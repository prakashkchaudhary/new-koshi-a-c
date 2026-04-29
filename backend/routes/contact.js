const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/contact - Get contact details
router.get('/', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create({});
    }
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/contact - Admin: Update contact details
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const { representativeName, phone, email, address, officeHours, mapEmbedUrl } = req.body;

    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact();
    }

    if (representativeName) contact.representativeName = representativeName;
    if (phone) contact.phone = phone;
    if (email) contact.email = email;
    if (address) contact.address = address;
    if (officeHours) contact.officeHours = officeHours;
    if (mapEmbedUrl !== undefined) contact.mapEmbedUrl = mapEmbedUrl;

    await contact.save();
    res.json({ success: true, message: 'Contact details updated', contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
