import Header from '../components/Header';
import Player from '../components/Player';

import '../styles/global.scss'
import styles from '../styles/app.module.scss'
import { PlayerContext } from '../contexts/PlayerContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {

  const [episodesList, setEpisodesList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  function play(episode) {
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
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>

        <Player />
      </div>
    </PlayerContext.Provider>
  );
}

export default MyApp
