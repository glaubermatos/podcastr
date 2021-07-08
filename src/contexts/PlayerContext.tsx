import { createContext, ReactNode, useState } from 'react'

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string
}

type PlayerContextData = {
    episodesList: Array<Episode>,
    currentEpisodeIndex: number,
    isPlaying: boolean,
    play: (episode: Episode) => void
    togglePlay: () => void
    setPlayingState: (state: boolean) => void
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerProviderProps = {
    children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerProviderProps) {
    const [episodesList, setEpisodesList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    function play(episode: Episode) {
        setEpisodesList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    function togglePlay() {
        setIsPlaying(!isPlaying)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }
    return (
        <PlayerContext.Provider
            value={{
                episodesList,
                currentEpisodeIndex,
                isPlaying,
                togglePlay,
                play,
                setPlayingState
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}