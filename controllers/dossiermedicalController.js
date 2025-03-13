const userModel = require("../models/userSchema");
const dossiermedicalModel = require("../models/dossiermedicalSchema");
const disponibiliteModel = require("../models/dispnibiliteSchema");


exports.getOrCreateDossierMedical = async (req, res) => {
    try {
        const { patientId } = req.params;

        let dossier = await dossiermedicalModel.findOne({ patient: patientId });

        if (!dossier) {
            dossier = new dossiermedicalModel({ patient: patientId, fiches: [] });
            await dossier.save();
        }

        res.status(200).json(dossier);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports.getHistoriquePatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        const dossierMedical = await disponibiliteModel.findOne({ patient: patientId }).populate('rendezVous.medecin', 'name speciality');

        if (!dossierMedical) return res.status(404).json({ message: 'Dossier médical non trouvé' });

        res.json(dossierMedical);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
module.exports.deleteDossierMedById = async (req, res) => {
    try {
        const id = req.params.id;

        // Vérifier si le dossier médical existe
        const dossierMedById = await dossiermedicalModel.findById(id);
        if (!dossierMedById) {
            return res.status(404).json({ message: "Dossier médical introuvable" });
        }

        await userModel.updateMany({}, { $pull: { dossiermedical: id } });

        await dossiermedicalModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Dossier médical supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.addDossierMed = async (req, res) => {
    try {
        const { patient, rendezVous } = req.body;

        if (!patient & !rendezVous) {
            throw new Error("errue data");
        }

        const dossierMed = await dossiermedicalModel.create({
            patient,
            rendezVous,
        });

        res.status(200).json({ dossierMed });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateDossierMed = async (req, res) => {
    try {
        const id = req.params.id;
        const { patient, rendezVous } = req.body;

        const dossierMedById = await dossiermedicalModel.findById(id);

        if (!dossierMedById) {
            throw new Error("dossier introuvable");
        }

        if (!patient & !rendezVous) {
            throw new Error("errue data");
        }

        await dossiermedicalModel.findByIdAndUpdate(id, {
            $set: { patient, rendezVous },
        });

        const updated = await dossiermedicalModel.findById(id);

        res.status(200).json({ updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 