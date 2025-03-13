var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

router.get('/getAllPatient', userController.getAllPatient);
router.get('/getPatientById', userController.getPatientById);
router.get('/searchPatientByUsername', userController.searchPatientByUsername);
router.put('/updatePatienById/:id',userController.updatePatienById);
router.delete('/deleteUPatientById /:id',userController.deleteUPatientById );

module.exports = router;