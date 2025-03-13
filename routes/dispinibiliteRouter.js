var express = require('express');
var router = express.Router();
const disponibiliteController = require('../controllers/disponibiliteController')

router.get('/getDisponibilite', disponibiliteController.getDisponibilite);
router.delete('/deleteDisponibiliteById', disponibiliteController.deleteDisponibiliteById);
router.post('/updatedisponibilite', disponibiliteController.updatedisponibilite);
router.put('/addDispoinibilite', disponibiliteController.addDispoinibilite );


module.exports = router;