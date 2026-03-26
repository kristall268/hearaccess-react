const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const authCtrl = require('../controllers/authController');
const teamCtrl = require('../controllers/teamController');
const formCtrl = require('../controllers/formController');
const submCtrl = require('../controllers/submissionsController');

// ── Auth ──
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', auth, authCtrl.me);

// ── Team (public read, admin write) ──
router.get('/team', teamCtrl.getAll);
router.get('/team/:id', teamCtrl.getOne);
router.post('/team', auth, upload.single('photo'), teamCtrl.create);
router.put('/team/:id', auth, upload.single('photo'), teamCtrl.update);
router.delete('/team/:id', auth, teamCtrl.remove);

// ── Public forms ──
router.post('/forms/partnership', formCtrl.submitPartnership);
router.post('/forms/volunteer', formCtrl.submitVolunteer);
router.post('/forms/contact', formCtrl.submitContact);

// ── Admin submissions ──
router.get('/admin/submissions', auth, submCtrl.getSubmissions);

module.exports = router;
