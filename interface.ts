export interface IArtist {
  name: string;
  id: string;
}
export interface Itracks {
  artists: IArtist[];
  name: string;
  preview_url: string;
}

export interface Isonglist {
  artist: string;
  name: string;
}

export interface Ititles {
  artist: string;
  name: string;
}

export interface Iusers {
  id: string;
  username: string;
  roomId: string;
  avatar: string;
  score: number;
  roundScore: number;
  host: boolean;
  winning: boolean;
}

export interface Irooms {
  id: string | string[]
  tracks: Itracks[];
  titles: Ititles[];
  currentTrack :Itracks;
  rounds: number
  currentRound: number;
  users: Iusers[];
}