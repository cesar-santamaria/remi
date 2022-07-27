import { Irooms, Itracks } from "../interface";

// Track selector function. Removes from array if selected.
const getTrack = (rooms: Irooms[], roomId: string): Itracks => {
  const currentRoom = rooms.findIndex(({ id }) => id === roomId);
  const rnmTrackNum = Math.floor(
    Math.random() * rooms[currentRoom].tracks.length
  );
  const newTrack = rooms[currentRoom].tracks[rnmTrackNum];

  rooms[currentRoom] = { ...rooms[currentRoom], currentTrack: newTrack };
  rooms[currentRoom].tracks.splice(rnmTrackNum, 1);

  return rooms[currentRoom].currentTrack;
};