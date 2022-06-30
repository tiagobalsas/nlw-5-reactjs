/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Image from 'next/image';

import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    toggleLoop,
    toggleShuffle,
    isShuffling,
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src='/playing.svg' alt='Tocando agora' />
        <strong>Tocando agora </strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            src={episode.thumbnail}
            alt={episode.title}
            width={592}
            height={592}
            objectFit='cover'
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            className={isShuffling ? styles.isActive : ''}
            type='button'
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
          >
            <img src='/shuffle.svg' alt='Embaralhar' />
          </button>

          <button
            type='button'
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src='/play-previous.svg' alt='Tocar anterior' />
          </button>

          <button
            type='button'
            disabled={!episode}
            className={styles.playButton}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src='/pause.svg' alt='Tocar' />
            ) : (
              <img src='/play.svg' alt='Tocar' />
            )}
          </button>

          <button
            type='button'
            disabled={!episode || !hasNext}
            onClick={playNext}
          >
            <img src='/play-next.svg' alt='Tocar próxima' />
          </button>

          <button
            className={isLooping ? styles.isActive : ''}
            type='button'
            disabled={!episode}
            onClick={toggleLoop}
          >
            <img src='/repeat.svg' alt='Repetir' />
          </button>
        </div>
      </footer>
    </div>
  );
}
