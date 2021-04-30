import { useContext, useEffect, useRef } from 'react'
import Image from 'next/image'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { PlayerContext } from '../../contexts/PlayerContext'
import styles from './Player.module.scss'

const Player = () => {
    const audioRef = useRef<HTMLAudioElement>(null)

    const {
        episodesList,
        currentEpisodeIndex,
        isPlaying,
        togglePlay,
        setPlayingState
    } = useContext(PlayerContext)

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
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {
                            episodePlaying ? (
                                <Slider
                                    trackStyle={{ backgroundColor: '#04D361' }}
                                    railStyle={{ backgroundColor: '#9F75FF' }}
                                    handleStyle={{ borderColor: '#04D361', borderWidth: 4 }}
                                />
                            ) : (
                                <div className={styles.emptySlider} />
                            )
                        }
                    </div>
                    <span>00:00</span>
                </div>

                {episodePlaying && <audio
                    src={episodePlaying.url}
                    ref={audioRef}
                    autoPlay
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                />}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episodePlaying}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" disabled={!episodePlaying}>
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
                    <button type="button" disabled={!episodePlaying}>
                        <img src="/play-next.svg" alt="Tocar próximo" />
                    </button>
                    <button type="button" disabled={!episodePlaying}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    )
}

export default Player