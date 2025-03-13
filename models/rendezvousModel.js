const mongoose = require('mongoose');

const rendezvouSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medecin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['confirmé', 'annulé'], default: 'confirmé' }
});

module.exports = mongoose.model('rendezvous', rendezvouSchema);
//module.exports = rendezvous;
