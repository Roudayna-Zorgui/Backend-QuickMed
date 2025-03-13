var express = require('express');
var router = express.Router();
const rendezvouscontroller = require('../controllers/rendezvouscontroller');

router.get('/getAppointmentsByPatient/:patientId', rendezvouscontroller.getAppointmentsByPatient);
router.get('/getAppointmentsByMedecin/:medecinId', rendezvouscontroller.getAppointmentsByMedecin);
router.post('/bookAppointment', rendezvouscontroller.bookAppointment);
router.delete('/cancelAppointment/:appointmentId', rendezvouscontroller.cancelAppointment);
module.exports = router;