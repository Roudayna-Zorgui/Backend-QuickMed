const userModel = require("../models/userSchema");
//const rendezvousModel = require("../models/rendezvouSchema");
const dossiermedicalModel = require("../models/dossiermedicalSchema");
//const disponibiliteModel = require("../models/dispnibiliteSchema");

module.exports.bookAppointment = async (req, res) => {
    try {
        const { patientId, medecinId, date, } = req.body;

        const patient = await userModel.findById(patientId);
        if (!patient) return res.status(404).json({ message: 'Patient non trouvé' });

        const medecin = await userModel.findById(medecinId);
        if (!medecin) return res.status(404).json({ message: 'Médecin non trouvé' });

        const dossierMedical = await getOrCreateDossierMedical(patientId);

        const nouveauRendezVous = new RendezVous({
            patient: patientId,
            medecin: medecinId,
            date,
            dossierMedical: dossiermedicalModel._id,
        });

        dossierMedical.rendezVous.push({
            date,
            medecin: medecinId,
            diagnostic,
            prescriptions: prescription,
        });

        await dossierMedical.save();
        await nouveauRendezVous.save();

        res.status(201).json({
            message: 'Rendez-vous pris avec succès',
            rendezVous: nouveauRendezVous,
            dossierMedical,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports.getAppointmentsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const appointments = await rendezvousModel.find({ patient: patientId }).populate('medecin', 'name speciality');
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports.getAppointmentsByMedecin = async (req, res) => {
    try {
        const { medecinId } = req.params;
        const appointments = await rendezvousModel.find({ medecin: medecinId }).populate('patient', 'name phone');
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports.cancelAppointment = async (req, res) => {
    try {
        await rendezvousModel.findByIdAndDelete(req.params.appointmentId);
        res.json({ message: 'Rendez-vous annulé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};    