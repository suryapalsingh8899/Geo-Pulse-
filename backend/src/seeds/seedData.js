import Report from "../models/Report.js";
import Event from "../models/Event.js";

export const initialReports = [
  {
    lat: 28.6139,
    lng: 77.209,
    title: "Traffic block at CP",
    description: "Heavy traffic blocking the road at Connaught Place.",
    upvotes: 12,
    downvotes: 2,
    media:
      "https://images.unsplash.com/photo-1517625126871-331da294c79f?w=400&q=80",
    image:
      "https://images.unsplash.com/photo-1517625126871-331da294c79f?w=400&q=80",
    video:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    author: {
      name: "Rajesh K.",
      profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  },
  {
    lat: 28.618,
    lng: 77.205,
    title: "Accident near CP",
    description: "A collision occurred near the main junction.",
    upvotes: 45,
    downvotes: 1,
    media:
      "https://images.unsplash.com/photo-1627392683056-b072834b6b63?w=400&q=80",
    image:
      "https://images.unsplash.com/photo-1627392683056-b072834b6b63?w=400&q=80",
    author: { name: "User", profilePic: null },
  },
  {
    lat: 28.61,
    lng: 77.215,
    title: "Waterlogging CP",
    description: "Severe waterlogging due to heavy rains.",
    upvotes: 8,
    downvotes: 5,
    media: null,
    video:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    author: {
      name: "Amit S.",
      profilePic: "https://randomuser.me/api/portraits/men/44.jpg",
    },
  },
  {
    lat: 28.615,
    lng: 77.21,
    title: "Roadwork CP",
    description: "Construction causing slow movement of vehicles.",
    upvotes: 2,
    downvotes: 0,
    media:
      "https://images.unsplash.com/photo-1584462198614-03c2a523945d?w=400&q=80",
    image:
      "https://images.unsplash.com/photo-1584462198614-03c2a523945d?w=400&q=80",
    author: {
      name: "Priya M.",
      profilePic: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  },
  {
    lat: 28.612,
    lng: 77.208,
    title: "Pothole CP",
    description: "Deep pothole in the middle lane.",
    upvotes: 15,
    downvotes: 0,
    media:
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80",
    image:
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80",
    author: {
      name: "Suresh",
      profilePic: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  },
  {
    lat: 19.076,
    lng: 72.8777,
    title: "Pothole on Linking Road",
    description: "Dangerous pothole needs fixing immediately.",
    upvotes: 23,
    downvotes: 1,
    media: null,
    author: {
      name: "Neha",
      profilePic: "https://randomuser.me/api/portraits/women/42.jpg",
    },
  },
  {
    lat: 19.08,
    lng: 72.88,
    title: "Traffic jam",
    description: "Complete gridlock on the highway.",
    upvotes: 120,
    downvotes: 10,
    media:
      "https://images.unsplash.com/photo-1555026600-b6ab76dff063?w=400&q=80",
    image:
      "https://images.unsplash.com/photo-1555026600-b6ab76dff063?w=400&q=80",
    video:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    author: { name: "User", profilePic: null },
  },
  {
    lat: 19.072,
    lng: 72.875,
    title: "Road block",
    description: "Road blocked due to a fallen tree.",
    upvotes: 0,
    downvotes: 0,
    media: null,
    author: {
      name: "Vikas",
      profilePic: "https://randomuser.me/api/portraits/men/51.jpg",
    },
  },
  {
    lat: 12.9716,
    lng: 77.5946,
    title: "Water logging in Koramangala",
    description: "Streets flooded, avoid the area.",
    upvotes: 4,
    downvotes: 0,
    media:
      "https://images.unsplash.com/photo-1519789115206-f131a4030635?w=400&q=80",
    image:
      "https://images.unsplash.com/photo-1519789115206-f131a4030635?w=400&q=80",
    author: {
      name: "Arun",
      profilePic: "https://randomuser.me/api/portraits/men/15.jpg",
    },
  },
  {
    lat: 22.5726,
    lng: 88.3639,
    title: "Accident reported",
    description: "Two-wheeler collision, ambulance on site.",
    upvotes: 1,
    downvotes: 0,
    media: null,
    author: {
      name: "Riya",
      profilePic: "https://randomuser.me/api/portraits/women/24.jpg",
    },
  },
  {
    lat: 13.0827,
    lng: 80.2707,
    title: "Road construction",
    description: "Diversions in place for ongoing metro work.",
    upvotes: 7,
    downvotes: 0,
    media: null,
    author: {
      name: "Kiran",
      profilePic: "https://randomuser.me/api/portraits/men/60.jpg",
    },
  },
];

export const initialEvents = [
  {
    lat: 28.62,
    lng: 77.2,
    title: "Delhi Music Festival",
    description:
      "Annual music festival at Connaught Place featuring local bands and food stalls. Come enjoy the evening!",
    poster:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
    timing: "6:00 PM - 11:00 PM, Oct 25",
    isPublic: true,
    photos: [
      "https://images.unsplash.com/photo-1540039155732-684736dd6330?w=400&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?w=400&q=80",
    ],
    videos: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    ],
    author: {
      name: "MusicFiesta",
      profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
    },
  },
  {
    lat: 19.07,
    lng: 72.87,
    title: "Tech Innovators Conference",
    description: "A premier tech conference in Mumbai focusing on AI and Web3.",
    poster:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
    timing: "9:00 AM - 5:00 PM, Nov 2-3",
    isPublic: false,
    photos: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
    ],
    videos: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    ],
    author: {
      name: "DevComm",
      profilePic: "https://randomuser.me/api/portraits/men/82.jpg",
    },
  },
  {
    lat: 12.97,
    lng: 77.59,
    title: "Bangalore Food Carnival",
    description: "Taste the best street food and cuisines from all over India.",
    poster:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    timing: "11:00 AM - 10:00 PM, Dec 15",
    isPublic: true,
    photos: [
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    ],
    videos: [],
    author: {
      name: "FoodieBengaluru",
      profilePic: "https://randomuser.me/api/portraits/men/33.jpg",
    },
  },
  {
    lat: 28.61,
    lng: 77.21,
    title: "Community Park Cleanup",
    description:
      "Join us this Sunday to clean our local park and make it green.",
    poster:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80fbea5?w=600&q=80",
    timing: "8:00 AM - 12:00 PM, Oct 30",
    isPublic: true,
    photos: [],
    videos: [],
    author: { name: "User", profilePic: null },
  },
  {
    lat: 28.65,
    lng: 77.23,
    title: "Local Book Club Meetup",
    description:
      "Monthly meetup for our local book club. We are discussing 'The Alchemist'.",
    poster:
      "https://images.unsplash.com/photo-1524578954443-4e8bd7412e87?w=600&q=80",
    timing: "4:00 PM - 6:00 PM, Nov 5",
    isPublic: false,
    photos: [],
    videos: [],
    author: { name: "User", profilePic: null },
  },
];

export async function seedDatabase() {
  try {
    const reportCount = await Report.countDocuments();
    if (reportCount === 0) {
      console.log("Seeding initial community reports...");
      await Report.insertMany(initialReports);
      console.log(`Seeded ${initialReports.length} reports.`);
    }

    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      console.log("Seeding initial community events...");
      await Event.insertMany(initialEvents);
      console.log(`Seeded ${initialEvents.length} events.`);
    }
  } catch (error) {
    console.error("Error seeding initial data:", error.message);
  }
}
