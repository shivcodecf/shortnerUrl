// models/Url.js
import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  ip: String,
  timestamp: { type: Date, default: Date.now }
});

const urlSchema = new mongoose.Schema({
  originalUrl: { 
    type: String, 
    required: true 
  },
  shortId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  userId:{
    
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  clicks: [clickSchema]
});

export default mongoose.model('Url', urlSchema);

