import mongoose from 'mongoose';

const commentarySchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: [true, 'Match ID is required'],
      index: true,
    },
    minute: {
      type: Number,
      required: [true, 'Minute is required'],
      min: 0,
    },
    sequence: {
      type: Number,
      required: [true, 'Sequence number is required'],
      min: 1,
    },
    period: {
      type: String,
      required: [true, 'Period is required'],
      trim: true,
      lowercase: true,
      enum: ['first', 'second', 'third', 'fourth', 'overtime', 'shootout'],
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      trim: true,
      lowercase: true,
      enum: ['goal', 'assist', 'shot', 'foul', 'card', 'substitution', 'injury', 'timeout', 'other'],
      index: true,
    },
    actor: {
      type: String,
      required: [true, 'Actor name is required'],
      trim: true,
    },
    team: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Commentary message is required'],
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for common queries
commentarySchema.index({ matchId: 1, sequence: 1 });
commentarySchema.index({ matchId: 1, minute: 1 });
commentarySchema.index({ team: 1, eventType: 1 });

const Commentary = mongoose.model('Commentary', commentarySchema);

export default Commentary;
