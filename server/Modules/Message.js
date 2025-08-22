const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderEmail: {
        type: String,
        required: true,
    },
    receiverEmail: {
        type: String,
        required: true,
    },
    // For text messages
    messageText: {
        type: String,
    },
    // For file messages
    fileUrl: {
        type: String,
    },
    originalname: {
        type: String,
    },
    mimetype: {
        type: String,
    },
    // The message type (e.g., 'text' or 'file')
    type: {
        type: String,
        enum: ['text', 'file'], // Enforce a specific set of values
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;