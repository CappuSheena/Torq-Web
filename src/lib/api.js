// This is just the web address of our OWN backend server (the Express app
// in /backend), not any outside API. Every fetch() in the app starts with
// this so we don't have to type "http://localhost:4000" everywhere.
// In production VITE_API_URL gets set to the real deployed backend address;
// locally it just falls back to your own machine on port 4000.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
