import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { usePlayer } from '../../contexts/PlayerContext'
import styles from './Player.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

const Player = () => {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0)

    const {
        episodesList,
        currentEpisodeIndex,
        isPlaying,
        playPrevious,
        playNext,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerState,
        togglePlay,
        setPlayingState
    } = usePlayer()

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }

    }, [isPlaying])

    const episodePlaying = episodesList[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            {
                episodePlaying ? (
                    <div className={styles.currentEpisode}>
                        <Image
                            width={592}
                            height={592}
                            src={episodePlaying.thumbnail}
                            alt={episodePlaying.title}
                            objectFit="cover"
                        />
                        <strong>{episodePlaying.title}</strong>
                        <span>{episodePlaying.members}</span>
                    </div>
                ) : (
                    <div className={styles.emptyPlayer}>
                        <strong>Selecione um podcast para ouvir</strong>
                    </div>
                )
            }

            <footer className={!episodePlaying ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {
                            episodePlaying ? (
                                <Slider
                                    max={episodePlaying.duration}
                                    value={progress}
                                    onChange={handleSeek}
                                    trackStyle={{ backgroundColor: '#04D361' }}
                                    railStyle={{ backgroundColor: '#9F75FF' }}
                                    handleStyle={{ borderColor: '#04D361', borderWidth: 4 }}
                                />
                            ) : (
                                <div className={styles.emptySlider} />
                            )
                        }
                    </div>
                    <span>{convertDurationToTimeString(episodePlaying?.duration ?? 0)}</span>
                </div>

                {episodePlaying && <audio
                    src={episodePlaying.url}
                    ref={audioRef}
                    autoPlay
                    onEnded={handleEpisodeEnded}
                    loop={isLooping}
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                    onLoadedMetadata={setupProgressListener}
                />}

                <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={!episodePlaying || episodesList.length === 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button
                        type="button"
                        disabled={!episodePlaying || !hasPrevious}
                        onClick={playPrevious}
                    >
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episodePlaying}
                        onClick={togglePlay}
                    >
                        {isPlaying ? (
                            <img src="/pause.svg" alt="Pausar" />
                        ) : (
                            <img src="/play.svg" alt="Tocar" />
                        )}
                    </button>
                    <button
                        type="button"
                        disabled={!episodePlaying || !hasNext}
                        onClick={playNext}
                    >
                        <img src="/play-next.svg" alt="Tocar próximo" />
                    </button>
                    <button
                        type="button"
                        disabled={!episodePlaying}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    )
}

export default Player