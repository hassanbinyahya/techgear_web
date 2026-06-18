const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userEmail: String,
  action: {
    type: String,
    required: true
  },
  entityName: String,
  entityId: mongoose.Schema.Types.ObjectId,
  details: String,
  ipAddress: String
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
