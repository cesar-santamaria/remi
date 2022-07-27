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

const findRoomIndex = (rooms: Irooms[], roomId: string): number | undefined => {
  if (!rooms) {
    return;
  }

  return rooms.findIndex(({ id }) => id === roomId);
};

const findUserIndex = (room: Irooms, idToFind: string): number | undefined => {
  let retIndex = -1;
  if (!room) return;
  if (room.users === [] || !room.users) return;
  retIndex = room.users.findIndex(({ id }) => id === idToFind);

  return retIndex;
};

module.exports = { getTrack, findRoomIndex, findUserIndex };
