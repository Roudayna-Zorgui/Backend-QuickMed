const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // L'avis est donné par un patient
        required: true,
    },
    
    message: {
        type: String,
        required: true,
    },
    rating: { // Note sur 5 étoiles
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    isApproved: { // L’admin  peut approuver ou masquer le commentaire
        type: Boolean,
        default: false,
    },
    

}, { timestamps: true });

const comment = mongoose.model('commentModel', commentSchema);
module.exports = comment;