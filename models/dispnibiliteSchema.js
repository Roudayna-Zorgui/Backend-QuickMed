const mongoose = require('mongoose');

const disponibiliteSchema = new mongoose.Schema({
    medecin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medecin',
        required: true,
    },
    jours: [{
        type: String, 
        required: true,
    }],
    heures: [{
        type: String, 
        required: true,
    }],
}, { timestamps: true });

module.exports = mongoose.model('disponibilite', disponibiliteSchema);
//module.exports = disponibilite;