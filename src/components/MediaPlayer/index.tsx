import React, { useRef, useEffect, useState } from 'react';
import {
  ILocalVideoTrack,
  IRemoteVideoTrack,
  ILocalAudioTrack,
  IRemoteAudioTrack,
  IAgoraRTCRemoteUser,
} from 'agora-rtc-sdk-ng';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.scss';
import classNames from 'classnames';

export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
  videoStyles?: {
    maxWidth: number;
    height: number;
  };
  pauseImage?: string;
  joinState: boolean;
  isZoom?: boolean;
  className?: string;
  id?: string;
  user?: IAgoraRTCRemoteUser;
  isOffLiveStream: boolean;
  isEndLiveStream: boolean;
}

const MediaPlayer = (props: VideoPlayerProps) => {
  const container = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [video, setVideo] = useState<boolean>(true);

  const {
    videoTrack,
    audioTrack,
    videoStyles,
    joinState,
    pauseImage,
    isZoom,
    className = '',
    id,
    isOffLiveStream,
    isEndLiveStream,
  } = props;

  useEffect(() => {
    if (!container.current || !joinState) return;
    videoTrack?.play(container.current);

    return () => {
      videoTrack?.stop();
    };
  }, [container, videoTrack, joinState]);

  useEffect(() => {
    if (!joinState) return;
    setVideo(!!videoTrack);
  }, [videoTrack, joinState]);

  useEffect(() => {
    if (audioTrack || joinState) {
      audioTrack?.play();
    }
    return () => {
      audioTrack?.stop();
    };
  }, [audioTrack, joinState]);

  return (
    <div
      className={classNames({
        'video-container': true,
        [styles.videoContainer]: true,
        [styles.zoom]: isZoom,
        [className]: !!className,
        [styles[className]]: !!className,
      })}
    >
      <div
        ref={container}
        className={classNames('video-player', styles.videoPlayer, {
          [styles.off]: (joinState && !video) || isOffLiveStream || isEndLiveStream,
        })}
        style={{ ...videoStyles, backgroundImage: pauseImage ? `url(${pauseImage})` : 'unset' }}
        id={id || 'video_player'}
      >
        {isEndLiveStream ? (
          <span className={styles.offVideoImage}>{t('live.error.liveEnded')}</span>
        ) : isOffLiveStream ? (
          <span className={styles.offVideoImage}>{t('live.error.liveHasOff')}</span>
        ) : (
          joinState && !video && <span className={styles.offVideoImage}>{t('live.error.outLive')}</span>
        )}
      </div>
    </div>
  );
};

export default MediaPlayer;
