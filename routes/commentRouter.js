var express = require('express');
var router = express.Router();
const commentController = require('../controllers/commentController');

// Routes pour gérer les avis des patients
router.post('/addComment', commentController.addComment);
router.get('/getAllApprovedComments', commentController.getAllApprovedComments);
router.put('/approveComment/:id', commentController.approveComment);
router.delete('/deleteComment/:id', commentController.deleteComment);

module.exports = router;