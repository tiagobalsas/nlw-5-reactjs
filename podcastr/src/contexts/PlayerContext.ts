import { createContext } from 'react';

type EpisodeType = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: EpisodeType[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: EpisodeType) => void;
  togglePlay: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);
