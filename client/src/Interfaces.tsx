import { BoxProps, TypographyProps } from "@mui/material";

export interface IUser {
  id: string;
  username: string;
  roomId: string;
  avatar: string;
  score: number;
  roundScore: number;
  host: boolean;
  winning: boolean;
}

export interface IArtist {
  artist: string;
  id: string;
}

export interface ITrack {
  name: string;
  artist: string;
  album: { images: [{ url: string }] };
  preview_url: string;
}

export interface ISocket {
  emit: (
    eventName: string,
    sentData: string | number,
    sentData2?: number,
    sentData3?: string | null
  ) => void;
  on: (eventName: string, callback: (data: any) => void) => void;
  disconnect: () => void;
}

export interface ITheme {
  palette: {
    primary: {
      main: string;
    };
    secondary: {
      main: string;
    };
  };
}

export interface INavProps {
  changeTheme: () => void;
  theme: ITheme;
}
export interface IAudioProps {
  src: string;
}

export interface IGameLobby {
  roomId: string;
  selectGenre: (newGenre: string) => void;
  startGame: (rounds: number) => void;
  host: boolean;
}

export interface IGameBoard extends IGameLobby {
  track: ITrack;
  mode: string;
  endOfRound: () => void;
  audio: HTMLAudioElement;
  users: IUser[];
  round: number;
  newGame: () => void;
  gameboardTheme: ITheme;
}

export interface IPlayGameProps {
  track: ITrack;
  endOfRound: () => void;
  audio: HTMLAudioElement;
  round: number;
  volume: number | string | Array<number | string>;
  setVolume: (
    value: React.SetStateAction<string | number | (string | number)[]>
  ) => void;
}

export interface IGameProps {
  user: IUser;
  socket: ISocket;
  setUser: (user: IUser) => void;
  gameboardTheme: ITheme;
}

export interface ILeaderboardProps {
  users: IUser[];
  gameboardTheme: ITheme;
}

export interface ILeaderboardCardProps {
  key: number;
  user: IUser;
  gameboardTheme: ITheme;
}
export interface IEndOfRoundProps {
  users: IUser[];
  track: ITrack;
  round: number;
}
export interface IEndOfGameProps {
  users: IUser[];
  newGame: () => void;
  host: boolean;
}
export interface IUserFormProps {
  createSocket: (username: IUser) => void;
  status: string;
}

export interface IGenreSelector {
  selectGenre: (newGenre: string) => void;
}

export interface IMessage {
  username: string | null;
  message: string;
  avatar: string;
}

export interface ITracklist {
  name: string;
  artist: string;
}

export interface IChatboxProps {
  tracklist: ITracklist[];
  message: string;
  setMessage: (message: string) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  messages: IMessage[];
  mode: string;
  gameboardTheme: ITheme;
}

export interface IAdvancedSettings {
  selectGenre: (message: string) => void;
  advancedSettings: boolean;
}

export interface StyledBoxProps extends BoxProps {
  animate?: boolean;
}

export interface IArtistContext {
  artist: string | null;
  setArtist: (artist: string | null) => void;
  artistList: IArtist[];
  setArtistList: (artistList: IArtist[]) => void;
  artistError: boolean;
  queryArtist: (searchParams: string) => void;
}

export interface StyledTypoProps extends TypographyProps {
  animate?: boolean;
}

export interface ILoadingProps {
  setStatus: (status: string) => void;
  socket: ISocket;
}
export interface IAppProps {
  fail?: boolean;
}
