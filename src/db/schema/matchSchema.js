import mongoose from 'mongoose';
import getMatchStatus from '../../utils/matchStatus.js';

const matchSchema = new mongoose.Schema(
  {
    homeTeam: {
      type: String,
      required: [true, 'Home team is required'],
      trim: true,
      index: true,
    },
    awayTeam: {
      type: String,
      required: [true, 'Away team is required'],
      trim: true,
      index: true,
    },
    sport: {
      type: String,
      required: [true, 'Sport type is required'],
      trim: true,
      lowercase: true,
      enum: ['football', 'basketball', 'cricket', 'tennis', 'hockey', 'baseball'],
      index: true,
    },
    status: {
      type: String,
      enum: ['schedule', 'live', 'finished'],
      
      index: true,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
      index: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
    homeScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    awayScore: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for common queries
matchSchema.index({ status: 1, startTime: -1 });
matchSchema.index({ homeTeam: 1, awayTeam: 1, sport: 1 });

matchSchema.pre('save', function () {
  const { status } = getMatchStatus(this.startTime, this.endTime)
  console.log(this.startTime,this.endTime)
  console.log(`Updating match status to: ${status} for match ${this.homeTeam} vs ${this.awayTeam}`);
  this.status = status;
  console.log(`Match status updated to: ${this.status} for match ${this.homeTeam} vs ${this.awayTeam}`);
  
});

const Match = mongoose.model('Match', matchSchema);

export default Match;
