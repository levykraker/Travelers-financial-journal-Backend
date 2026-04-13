const express = require('express');
const router = express.Router();
const AuthService = require("../src/auth/authService");
const TripService = require('../src/trip/tripService');
const authMiddleware = require("../src/middleware/authMiddleware");


// ---- Auth ---- 
router.post("/auth/register", AuthService.registerUser);
router.post("/auth/login", AuthService.loginUser);

//---- Trip ----
router.post('/trip/create',authMiddleware,TripService.createTrip);
router.get('/trip/read',authMiddleware,TripService.getAllTrips);
router.get('/trip/read/:id',authMiddleware,TripService.getTripById);
router.delete('/trip/delete/:id',authMiddleware,TripService.deleteTrip);
router.put('/trip/update/:id',authMiddleware,TripService.updateTrip);



module.exports = router;