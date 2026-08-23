import mongoose from "mongoose";
import dns from "node:dns";
import { initialReports, initialEvents } from "../seeds/seedData.js";

// Ensure reliable SRV DNS resolution on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if not supported in environment
}

export let isMongoConnected = false;

// In-memory collections as seamless fallback when MongoDB server is not running
export const memoryStore = {
  users: [],
  reports: [...initialReports.map((r, i) => ({ ...r, _id: `mem_rep_${i + 1}`, id: `mem_rep_${i + 1}`, upvotedBy: [], downvotedBy: [], seenBy: [] }))],
  events: [...initialEvents.map((e, i) => ({ ...e, _id: `mem_ev_${i + 1}`, id: `mem_ev_${i + 1}`, upvotedBy: [], seenBy: [] }))],
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/geopulse";

  try {
    mongoose.set("bufferCommands", false);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });

    isMongoConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}/${conn.connection.name}`);
    
    // Seed initial reports and events if empty
    const Report = (await import("../models/Report.js")).default;
    const Event = (await import("../models/Event.js")).default;
    
    const reportCount = await Report.countDocuments().catch(() => 0);
    if (reportCount === 0) {
      await Report.insertMany(initialReports).catch(() => {});
      console.log(`🌱 Seeded ${initialReports.length} reports into MongoDB.`);
    }

    const eventCount = await Event.countDocuments().catch(() => 0);
    if (eventCount === 0) {
      await Event.insertMany(initialEvents).catch(() => {});
      console.log(`🌱 Seeded ${initialEvents.length} events into MongoDB.`);
    }
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️ MongoDB not connected (${error.message}).`);
    console.log(`⚡ Running with instant In-Memory Store (${memoryStore.reports.length} reports, ${memoryStore.events.length} events ready).`);
  }
};

export default connectDB;
