const mongoose = require('mongoose');

const dossiermedicalSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    historique: {
        type: String, // 
        required: false,
    },
    rendezVous: [
        {
            date: {
                type: Date,
                required: true,
            },
            medecin: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Medecin',
                required: true,
            },
        },
    ],
    diagnostic: {
        type: String,
        required: false,
    },
    prescriptions: {
        type: String, // Prescription du médecin
        required: false,
    },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', unique: true }
}, { timestamps: true });

module.exports = mongoose.model('dossiermedical', dossiermedicalSchema);
//module.exports = dossiermedical;
