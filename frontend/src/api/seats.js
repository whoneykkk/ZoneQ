import client from "./client";

export const fetchSeats = (zone) => {
  const params = zone ? { zone } : {};
  return client.get("/seats", { params }).then((r) => r.data.data);
};

export const assignSeat = (zone, seatNumber) =>
  client.post("/seats/assign", { zone, seatNumber }).then((r) => r.data);

export const extendTime = (hours) =>
  client.post("/seats/extend", { hours }).then((r) => r.data);
