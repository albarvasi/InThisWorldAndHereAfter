// data.js

// Each item has:
// - id: unique string
// - eventId: matches an event's id
// - type: "image" or "video"
// - src: path relative to index.html
// - caption: short text
// - people: array of tags (for filtering by "who is in it")

const EVENTS = [
  {
    id: "roka-2024-11-29",
    name: "Baat Pakki Ceremony – 29 November 2025",
    description: "The day our families made it official. 💍",
    coverImage: "images/image0.jpeg"
  }
  // Later add more:
  // { id: "mehndi-2025-02-10", name: "...", description: "...", coverImage: "..." }
];

const MEDIA_ITEMS = [
  {
    id: "roka-photo-1",
    eventId: "roka-2024-11-29",
    type: "image",
    src: "images/image0.jpeg",
    caption: "Ceremonial Plaque",
    people: ["Albar", "Bushra"]
  },
  {
    id: "roka-photo-2",
    eventId: "roka-2024-11-29",
    type: "image",
    src: "images/image1.jpeg",
    caption: "Candids",
    people: ["Albar", "Bushra"]
  },
  {
    id: "roka-photo-2",
    eventId: "roka-2024-11-29",
    type: "image",
    src: "images/image2.jpeg",
    caption: "Candids",
    people: ["Albar", "Bushra"]
  },
  {
    id: "roka-photo-2",
    eventId: "roka-2024-11-29",
    type: "image",
    src: "images/image3.jpeg",
    caption: "Candids",
    people: ["Albar", "Bushra"]
  },
  {
    id: "roka-video-1",
    eventId: "roka-2024-11-29",
    type: "video",
    src: "videos/roka-2024-11-29/vid1.mp4",
    caption: "Cake cutting moment 🥹",
    people: ["Albar", "Bushra"]
  }
  // Keep adding items as you have more photos/videos
];
