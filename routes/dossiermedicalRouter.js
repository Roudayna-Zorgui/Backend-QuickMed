var express = require('express');
var router = express.Router();
const dossiermedicalController = require('../controllers/dossiermedicalController')

router.get('/getHistoriquePatient/:patient',dossiermedicalController .getHistoriquePatient);
router.get('/getOrCreateDossierMedical/:patientId', dossiermedicalController.getOrCreateDossierMedical);
router.delete('/deleteDossierMedById/:id', dossiermedicalController.deleteDossierMedById);
router.post('/addDossierMed/:patientId', dossiermedicalController.addDossierMed);
router.put('/updateDossierMed/:patientId', dossiermedicalController.updateDossierMed);

module.exports = router;