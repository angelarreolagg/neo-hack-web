export {};

declare global {
  type EventItem = {
    image: string;
    title: string;
    slug: string;
    location: string;
    date: string; // e.g., "2024-09-15"
    time: string; // e.g., "10:00 AM"
  };
}
