const userModel = require("../models/userSchema");
const disponibiliteModel = require("../models/dispnibiliteSchema");


module.exports.getDisponibilite = async (req, res) => {
    try {
        const { medecinId, jours, heures } = req.body;

        const medecin = await userModel.findById(medecinId);
        if (!medecin) return res.status(404).json({ message: 'Médecin non trouvé' });

        const disponibilite = await disponibiliteModel.findOne({ medecin: medecinId });
        if (disponibilite) {
            
            disponibilite.jours = jours;
            disponibilite.heures = heures;
            await disponibilite.save();
        } else {
            
            const newDisponibilite = new disponibiliteModel({
                medecin: medecinId,
                jours,
                heures,
            });
            await newDisponibilite.save();
        }

        res.status(200).json({ message: 'Disponibilités mises à jour avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports.deleteDisponibiliteById = async (req, res) => {
    try {
        const id = req.params.id;

        const disponibliteById = await disponibiliteModel.findById(id);

        if (!disponibliteById  || disponibliteById .length === 0) {
            throw new Error("dossier introuvable");
        }


        await disponibiliteModel.updateMany({}, {
            $pull: { disponibilite: id },
        });

        await disponibiliteModel.findByIdAndDelete(id);

        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.addDispoinibilite = async (req, res) => {
    try {
        const {jours , heures } = req.body;

        if (!jours & !heures  ) {
            throw new Error("errue data");
        }

        const disponibilite= await disponibiliteModel.create({
            jours,
            module,
        });

        res.status(200).json({ disponibilite });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updatedisponibilite = async (req, res) => {
try {
    const id = req.params.id;
    const { jours, heures } = req.body;

    const disponibiliteById = await disponibiliteModel.findById(id);

    if (!disponibiliteById) {
        throw new Error("disponibilite introuvable");
    }

    if (jours, heures) {
        throw new Error("errue data");
    }

    await disponibiliteById.findByIdAndUpdate(id, {
        $set: { jours, heures },
    });

    const updated = await disponibiliteModel.findById(id);

    res.status(200).json({ updated });
} catch (error) {
    res.status(500).json({ message: error.message });
}
};
