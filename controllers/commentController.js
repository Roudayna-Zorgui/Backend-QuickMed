const commentModel = require('../models/commentSchema');
const userModel = require('../models/userSchema'); // Assurez-vous que l'utilisateur a un rôle admin

exports.addComment = async (req, res) => {
    try {
        const { patientId, message, rating } = req.body;

        // Vérifier si le patient existe
        const patient = await userModel.findById(patientId);
        if (!patient) return res.status(404).json({ message: "Patient non trouvé" });

       
        // Créer le commentaire
        const newComment = new commentModel({
            patient: patientId,
            medecin: medecinId,
            message,
            rating,
            isApproved: false, // L'avis doit être approuvé avant d'être affiché
        });

        await newComment.save();
        res.status(201).json({ message: "Commentaire ajouté, en attente d'approbation", comment: newComment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer les commentaires approuvés
exports.getAllApprovedComments = async (req, res) => {
    try {
        const comments = await commentModel.find({ isApproved: true }).populate("patient").populate("medecin");
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Approuver un commentaire (SEUL L'ADMIN PEUT FAIRE CECI)
module.exports.approveComment = async (req, res) => {
    try {
        const { adminId } = req.body; // L'ID de l'admin qui approuve
        const admin = await userModel.findById(adminId);

        // Vérifier si l'utilisateur est un admin
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé. Seul un admin peut approuver les commentaires." });
        }

        const comment = await commentModel.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Commentaire non trouvé" });

        comment.isApproved = true;
        await comment.save();
        res.status(200).json({ message: "Commentaire approuvé", comment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer un commentaire (SEUL L'ADMIN PEUT FAIRE CECI)
module.exports.deleteComment = async (req, res) => {
    try {
        const { adminId } = req.body; // L'ID de l'admin qui supprime
        const admin = await userModel.findById(adminId);

        // Vérifier si l'utilisateur est un admin
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé. Seul un admin peut supprimer les commentaires." });
        }

        const comment = await commentModel.findByIdAndDelete(req.params.id);
        if (!comment) return res.status(404).json({ message: "Commentaire non trouvé" });

        res.status(200).json({ message: "Commentaire supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};