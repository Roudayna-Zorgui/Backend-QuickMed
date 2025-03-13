var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')


router.get('/getAllMedecins', userController.getAllMedecins);
router.get('/getMedecinById/:id', userController.getMedecinById);
router.get('/searchMedecin', userController.searchMedecin);
router.put('/addAssistantToMedecin', userController.addAssistantToMedecin);
router.put('/updateMedecinById/:id',userController.updateMedecinById);
router.delete('/deleteMedeinById/:id', userController.deleteMedecinById);

module.exports = router;