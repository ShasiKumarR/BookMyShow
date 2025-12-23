import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================
// Seat APIs
// ======================

export const fetchSeats = (showId) =>
  API.get(`/seats/${showId}`);

export const holdSeat = (data) =>
  API.post("/booking/hold", data);

export const confirmBooking = (data) =>
  API.post("/booking/confirm", data);

export const cancelHold = (data) =>
  API.post("/booking/cancel", data);

export default API;
