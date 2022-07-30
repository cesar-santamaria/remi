// create a random 6 character code to use as a room ID.
const generateRoomId = (): string => {
  let password: string = "";
  const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < 6; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return password;
};

export const getUrlParams = (): string => {
  const windowUrl: string = window.location.search;
  const roomId: string = windowUrl.substring(1);
  return roomId;
};

// retrieves the room ID.
export const getRoomId = (): string => {
  let roomId = getUrlParams();
  if (!roomId) {
    roomId = generateRoomId();
  }
  return roomId;
};
