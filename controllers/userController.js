const userModel = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const maxTime = 24 *60 * 60 //24H
//const maxTime = 1 * 60 //1min
const createToken = (id) => {
    return jwt.sign({id},'net secret pfe', {expiresIn: maxTime })
}
//67a73ce6ce362ba943c4c9d3 + net secret pfe + 1m
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Yjc0MjE5ZTFhMTM2OWRlZmZkNzJiMCIsImlhdCI6MTc0MDA2MzI2MCwiZXhwIjoxNzQwNjY4MDYwfQ.38r9wuoAG-Toz_e5yPf1uBdv8bAxgWqU58FaZHUBYeA
module.exports.addUserWithImg = async (req, res) => {
    try {
        const { username, email, password, } = req.body;
        const roleUser = 'patient'
        const { filename } = req.file

        const user = await userModel.create({
            username, email, password, role: roleUser, user_image: filename
        })
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.addUserWithImg = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const roleUser = 'medecin'
        const { filename } = req.file

        const user = await medecinModel.create({
            username, email, password, role: roleUser, user_image: filename
        })
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports.addUserAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const roleAdmin = 'admin'
        const user = await userModel.create({
            username, email, password, role: roleAdmin
        })
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getAllUsers = async (req, res) => {
    try {
        const userListe = await userModel.find()

        res.status(200).json({ userListe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getUserById = async (req, res) => {
    try {
        //const id = req.params.id
        const { id } = req.params
        //console.log(req.params.id)
        const user = await userModel.findById(id)

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params

        const checkIfUserExists = await userModel.findById(id);
        if (!checkIfUserExists) {
            throw new Error("User not found");
        }

        await userModel.findByIdAndDelete(id)

        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.updateUserById = async (req, res) => {
    try {
        const { id } = req.params
        const { email, username } = req.body;

        await userModel.findByIdAndUpdate(id, { $set: { email, username } })
        const updated = await userModel.findById(id)

        res.status(200).json({ updated })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.searchUserByUsername = async (req, res) => {
    try {

        const { username } = req.query
        if (!username) {
            throw new Error("Veuillez fournir un nom pour la recherche.");
        }

        const userListe = await userModel.find({
            username: { $regex: username, $options: "i" }
        })

        if (!userListe) {
            throw new Error("User not found");
        }
        const count = userListe.length
        res.status(200).json({ userListe, count })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports.getAllAdmin = async (_req, res) => {
    try {

        const userListe = await userModel.find({ role: "admin" })

        res.status(200).json({ userListe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.addUserPatient = async (req,ter) => {
    try {
        const { username, email, password, phone, dateNaissance} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({ username, email, password: hashedPassword, phone, dateNaissance,role: 'patient' });
        await newUser.save();

        const newPatient= new userModel({ user: newUser._id,});
        await newPatient.save();

        ter.status(201).json({ message: 'Patient enregistré avec succès', user: newUser });
    } catch (err) {
        ter.status(500).json({ error: err.message });
    }
};

module.exports.addUserMedecin = async (req, res) => {
    try {
        const { username, email, password, phone, speciality,} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({ username, email, password: hashedPassword, phone, role: 'medecin' });
        await newUser.save();

        const newMedecin = new userModel({ user: newUser._id, speciality,});
        await newMedecin.save();

        res.status(201).json({ message: 'Médecin enregistré avec succès', user: newUser, medecin: newMedecin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.getAllPatient = async (_req, res) => {
    try {

        const userListe = await userModel.find({ role: "patient" })

        res.status(200).json({ userListe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await userModel.findOne({ user: id }).populate('user', 'name email phone');

        if (!patient) return res.status(404).json({ message: "patient non trouvé" });

        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports.searchPatientByUsername = async (req, res) => {
    try {

        const { username } = req.query
        if (!username) {
            throw new Error("Veuillez fournir un nom pour la recherche.");
        }

        const userListe = await userModel.find({
            username: { $regex: username, $options: "i" }
        })

        if (!userListe) {
            throw new Error("patient not found");
        }
        const count = userListe.length
        res.status(200).json({ userListe, count })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.deleteUPatientById = async (req, res) => {
    try {
        const { id } = req.params

        const checkIfUserExists = await patch.findById(id);
        if (!checkIfUserExists) {
            throw new Error("patient not found");
        }

        await userModel.findByIdAndDelete(id)

        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.updatePatienById = async (req, res) => {
    try {
        const { id } = req.params
        const { email, username } = req.body;

        await userModel.findByIdAndUpdate(id, { $set: { email, username } })
        const updated = await userModel.findById(id)

        res.status(200).json({ updated })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.searchMedecin = async (req, res) => {
    try {
        const { speciality } = req.query;
        const medecins = await userModel.find({ speciality }).populate('user', 'name email phone');
        res.json(medecins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports.addAssistantToMedecin = async (req, res) => {
    try {
        const { medecinId, assistantId } = req.body;

        const medecin = await userModel.findById(medecinId);
        if (!medecin) return res.status(404).json({ message: 'Médecin non trouvé' });

        const assistant = await User.findById(assistantId);
        if (!assistant || assistant.role !== 'assistant') return res.status(400).json({ message: 'Utilisateur non valide pour être assistant' });

        if (!medecin.assistants.includes(assistantId)) {
            medecin.assistants.push(assistantId);
            await medecin.save();
            res.status(200).json({ message: 'Assistant ajouté avec succès', medecin });
        } else {
            res.status(400).json({ message: 'Cet assistant est déjà ajouté' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports.addUserMedecinWithImg = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const roleMedecin = 'medecin'
        const { filename } = req.file

        const user = await userModel.create({
            username, email, password, role: roleMedecin, user_image: filename
        })
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.getAllMedecins = async (_req, res) => {
    try {
        const medecins = await userModel.find({ role: 'medecin' });
        res.json(medecins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports.getMedecinById = async (req, res) => {
    try {
        const { id } = req.params;
        const medecin = await userModel.findOne({ user: id }).populate('user', 'name email phone');

        if (!medecin) return res.status(404).json({ message: "Médecin non trouvé" });

        res.json(medecin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports.searchMedecinByUsername = async (req, res) => {
    try {

        const { username } = req.query
        if (!username) {
            throw new Error("Veuillez fournir un nom pour la recherche.");
        }

        const userListe = await userModel.find({
            username: { $regex: username, $options: "i" }
        })

        if (!userListe) {
            throw new Error("Medecin not found");
        }
        const count = userListe.length
        res.status(200).json({ userListe, count })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.deleteMedecinById = async (req, res) => {
    try {
        const { id } = req.params

        const checkIfUserExists = await userModel.findById(id);
        if (!checkIfUserExists) {
            throw new Error("Medecin not found");
        }

        await userModel.findByIdAndDelete(id)

        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.updateMedecinById = async (req, res) => {
    try {
        const { id } = req.params
        const { email, username } = req.body;

        await userModel.findByIdAndUpdate(id, { $set: { email, username } })
        const updated = await userModel.findById(id)

        res.status(200).json({ updated })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.login= async (req,res) => {
    try {
        const { email , password } = req.body;
        const user = await userModel.login(email, password)
        const token = createToken(user._id)
        res.cookie("jwt_token-QuickMED", token, {httpOnly:false,maxAge:maxTime * 1000})
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.logout= async (_req,res) => {
    try {
  
        res.cookie("jwt_token_QuickMed", "", {httpOnly:false,maxAge:1})
        res.status(200).json("logged")
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


        

