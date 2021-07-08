import { createContext, ReactNode, useContext, useState } from 'react'

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
    play: (episode: Episode) => void,
    playList: (list: Array<Episode>, index: number) => void,
    playNext: () => void,
    playPrevious: () => void,
    hasNext: boolean,
    hasPrevious: boolean,
    togglePlay: () => void,
    setPlayingState: (state: boolean) => void,
    isLooping: boolean,
    toggleLoop: () => void,
    toggleShuffle: () => void
    isShuffling: boolean,
    clearPlayerState: () => void,
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerProviderProps = {
    children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerProviderProps) {
    const [episodesList, setEpisodesList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    function play(episode: Episode) {
        setEpisodesList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    function playList(list: Episode[], index: number) {
        setEpisodesList(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }

    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodesList.length
    const hasPrevious = (currentEpisodeIndex - 1) >= 0

    function playNext() {

        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodesList.length)

            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
    }

    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    function togglePlay() {
        setIsPlaying(!isPlaying)
    }

    function toggleLoop() {
        setIsLooping(!isLooping)
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    function clearPlayerState() {
        setEpisodesList([])
        setCurrentEpisodeIndex(0)
    }

    return (
        <PlayerContext.Provider
            value={{
                episodesList,
                currentEpisodeIndex,
                isPlaying,
                togglePlay,
                play,
                playList,
                playNext,
                playPrevious,
                setPlayingState,
                hasNext,
                hasPrevious,
                isLooping,
                toggleLoop,
                toggleShuffle,
                isShuffling,
                clearPlayerState
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}