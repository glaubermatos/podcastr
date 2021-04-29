import { createContext } from 'react'

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
}

type PlayerContextData = {
    episodesList: Array<Episode>,
    currentEpisodeIndex: number,
    play: (episode: Episode) => void
}

export const PlayerContext = createContext({} as PlayerContextData)