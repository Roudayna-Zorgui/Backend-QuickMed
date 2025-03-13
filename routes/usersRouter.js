var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const {requireAuthUser} = require('../middlewares/authMiddlewares');

//Gestion des utilisateurs  
router.post('/login',userController.login); 
router.post('/logout',userController.logout); 
router.post('/addUserPatient',userController.addUserPatient); 
router.post('/addUserMedecin',userController.addUserMedecin); 
router.post('/addUserAdmin',userController.addUserAdmin);
router.post('/login',userController.login); 
router.post('/logout',userController.logout);    
router.get('/getAllUsers',userController.getAllUsers); 
router.get('/getUserById/:id',userController.getUserById); 
router.get('/searchUserByUsername',userController.searchUserByUsername);   
router.get('/getAllAdmin',userController.getAllAdmin);  
router.put('/updateuserById/:id',userController.updateUserById); 
//router.post('/login', userController.login);
router.delete('/deleteUserById/:id', userController.deleteUserById);
//medecin
router.get('/getAllMedecins', userController.getAllMedecins);
router.get('/getMedecinById/:id', userController.getMedecinById);
router.get('/searchMedecin', userController.searchMedecin);
router.put('/addAssistantToMedecin', userController.addAssistantToMedecin);
router.put('/updateMedecinById/:id',userController.updateMedecinById);
router.delete('/deleteMedeinById/:id', userController.deleteMedecinById);
//patient
router.get('/getAllPatient', userController.getAllPatient);
router.get('/getPatientById', userController.getPatientById);
router.get('/searchPatientByUsername', userController.searchPatientByUsername);
router.put('/updatePatienById/:id',userController.updatePatienById);
router.delete('/deleteUPatientById /:id',userController.deleteUPatientById );



router.post('/addUserPatient', async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Vérifie si les données sont valides
        if (!username || !email || !password || !phone) {
            return res.status(400).json({ error: "Tous les champs sont requis" });
        }

        // Vérifie si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "L'utilisateur existe déjà" });
        }

        // Crée un nouvel utilisateur
        const newUser = new User({
            username,
            email,
            password,
            phone
        });

        await newUser.save();
        res.status(201).json({ message: "Utilisateur ajouté avec succès !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;



module.exports = router;

