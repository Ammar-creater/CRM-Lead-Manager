const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lead name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[\d\s-]{10,}$/, 'Please provide a valid phone number']
  },
  status: {
    type: String,
    enum: {
      values: ['new', 'contacted', 'converted'],
      message: 'Status must be new, contacted, or converted'
    },
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedToName: {
    type: String,
    default: 'Unassigned'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'cold_call', 'email', 'other'],
    default: 'other'
  },
  lastContacted: Date,
  convertedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


leadSchema.index({ createdBy: 1, status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text', phone: 'text' });


leadSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'converted' && !this.convertedAt) {
    this.convertedAt = new Date();
  }
  next();
});

leadSchema.pre(/^find/, function(next) {
  this.where({ isDeleted: false });
  next();
});


leadSchema.virtual('daysSinceCreated').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Lead', leadSchema);