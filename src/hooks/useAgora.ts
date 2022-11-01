import { useState, useEffect, useCallback } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  MicrophoneAudioTrackInitConfig,
  CameraVideoTrackInitConfig,
  ILocalVideoTrack,
  ILocalAudioTrack,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
} from 'agora-rtc-sdk-ng';
import configs from 'config';
import { AGORA_ERROR_CODE, ROLE } from 'constants/constants';

export default function useAgora(client: IAgoraRTCClient | undefined): {
  localAudioTrack: ILocalAudioTrack | undefined;
  localVideoTrack: ILocalVideoTrack | undefined;
  joinState: boolean;
  remoteUsers: IAgoraRTCRemoteUser[];
  leave: () => void;
  join: (channel: string, token: string, host?: boolean) => void;
  toggleLocalAudio: () => void;
  toggleLocalVideo: () => void;
  toggleRemoteAudio: () => void;
  toggleRemoteVideo: () => void;
  changeAudioVolume: (value: number) => void;
  audio: boolean;
  video: boolean;
  remoteAudio: boolean;
  remoteVideo: boolean;
  audioVolume: number;
  errorCode: number | null;
} {
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | undefined>(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | undefined>(undefined);
  const [audio, setAudio] = useState<boolean>(true);
  const [video, setVideo] = useState<boolean>(true);
  const [remoteAudio, setRemoteAudio] = useState<boolean>(true);
  const [remoteVideo, setRemoteVideo] = useState<boolean>(true);
  const [audioVolume, setAudioVolume] = useState<number>(100);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  const [joinState, setJoinState] = useState(false);

  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  async function createLocalTracks(
    audioConfig?: MicrophoneAudioTrackInitConfig,
    videoConfig?: CameraVideoTrackInitConfig
  ) {
    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(audioConfig, videoConfig);
    setLocalAudioTrack(microphoneTrack);
    setLocalVideoTrack(cameraTrack);
    return [microphoneTrack, cameraTrack];
  }

  useEffect(() => {
    if (localAudioTrack && joinState) {
      localAudioTrack.setEnabled(audio);
    }
  }, [audio, localAudioTrack, joinState]);

  useEffect(() => {
    if (localVideoTrack && joinState) {
      localVideoTrack.setEnabled(video);
    }
  }, [video, localVideoTrack, joinState]);

  useEffect(() => {
    AgoraRTC.onAutoplayFailed = () => {
      setRemoteAudio(false);
    };
  }, []);

  useEffect(() => {
    if (!remoteUsers.length) return;
    if (remoteVideo) {
      if (!remoteUsers.find((user) => user.uid === ROLE.STORE)?.videoTrack?.isPlaying) {
        remoteUsers.find((user) => user.uid === ROLE.STORE)?.videoTrack?.play('video_player');
      }
      if (!remoteUsers.find((user) => user.uid === ROLE.USER)?.videoTrack?.isPlaying) {
        remoteUsers.find((user) => user.uid === ROLE.USER)?.videoTrack?.play('remote_video_player');
      }
      return;
    }
    remoteUsers.forEach((user) => {
      user.videoTrack?.stop();
    });
  }, [remoteVideo, remoteUsers]);

  useEffect(() => {
    if (!remoteUsers.length) return;
    if (remoteAudio && remoteVideo) {
      return remoteUsers.forEach((user) => {
        user.audioTrack?.play();
      });
    }
    remoteUsers.forEach((user) => {
      user.audioTrack?.stop();
    });
  }, [remoteAudio, remoteUsers, remoteVideo]);

  async function join(channel: string, token?: string, host?: boolean) {
    if (!client) return;
    if (host) {
      let microphone;
      let video;
      try {
        const [microphoneTrack, cameraTrack] = await createLocalTracks(undefined, {
          encoderConfig: '720p',
        });
        microphone = microphoneTrack;
        video = cameraTrack;
        if (!client || !microphoneTrack || !cameraTrack) return;
        await client.setClientRole('host');
        await client.join(configs.AGORA_APP_ID || '', channel, token || null, ROLE.USER);
        await client.publish([microphoneTrack, cameraTrack]);

        (window as any).client = client;
        (window as any).videoTrack = cameraTrack;

        setJoinState(true);
      } catch (error) {
        await leave(microphone, video);
        console.log('Error start video call', error);
        const errorMsg = JSON.stringify(error);
        if (errorMsg.includes('dynamic key expired')) {
          setErrorCode(AGORA_ERROR_CODE.KEY_EXPIRED);
        } else if (errorMsg.includes('Permission denied')) {
          setErrorCode(AGORA_ERROR_CODE.CANT_CONNECT_SOURCE);
        } else if (errorMsg.includes('Requested device not found') || errorMsg.includes('NotReadableError')) {
          setErrorCode(AGORA_ERROR_CODE.CANT_START_SOURCE);
        }
      }
    } else {
      try {
        // const [microphoneTrack, cameraTrack] = await createLocalTracks();
        // if (!client || !microphoneTrack || !cameraTrack) return;
        await client.setClientRole('audience', { level: 1 });
        await client.join(configs.AGORA_APP_ID || '', channel, token || null);
        // await client.publish([microphoneTrack, cameraTrack]);

        (window as any).client = client;
        // (window as any).videoTrack = cameraTrack;

        setJoinState(true);
      } catch (error) {
        console.log('Error start video call', error);
      }
    }
  }

  async function leave(
    microphone?: IMicrophoneAudioTrack | ICameraVideoTrack,
    video?: ICameraVideoTrack | IMicrophoneAudioTrack
  ) {
    const audioTrack = microphone || localAudioTrack;
    const videoTrack = video || localVideoTrack;
    if (audioTrack) {
      audioTrack.stop();
      audioTrack.close();
    }
    if (videoTrack) {
      videoTrack.stop();
      videoTrack.close();
    }
    setRemoteUsers([]);
    setJoinState(false);
    await client?.leave();
  }

  const toggleLocalAudio = useCallback(() => {
    setAudio(!audio);
  }, [audio]);

  const toggleLocalVideo = useCallback(() => {
    setVideo(!video);
  }, [video]);

  const toggleRemoteAudio = useCallback(() => {
    setRemoteAudio(!remoteAudio);
  }, [remoteAudio]);

  const toggleRemoteVideo = useCallback(() => {
    if (!remoteUsers.length) return;
    setRemoteVideo(!remoteVideo);
    if (remoteVideo) {
      // off video
      if (remoteAudio) {
        remoteUsers[0].audioTrack?.stop();
      }
    } else {
      // on video
      if (remoteAudio) {
        remoteUsers[0].audioTrack?.play();
      }
    }
  }, [remoteVideo, remoteAudio, remoteUsers]);

  const changeAudioVolume = useCallback(
    (value: number) => {
      if (remoteUsers?.length) {
        remoteUsers.forEach((user) => user.audioTrack?.setVolume(value));
        // remoteUsers[0].audioTrack?.setVolume(value);
        setAudioVolume(value);
        setRemoteAudio(true);
      }
    },
    [remoteUsers]
  );

  useEffect(() => {
    if (!client) return;
    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType);
      // toggle rerender while state of remoteUsers changed.
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };
    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };
    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };
    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);
    client.on('published-user-list', handleUserLeft);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
      client.off('published-user-list', handleUserLeft);
    };
  }, [client]);

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    remoteUsers,
    leave,
    join,
    toggleLocalAudio,
    toggleLocalVideo,
    toggleRemoteAudio,
    toggleRemoteVideo,
    changeAudioVolume,
    audio,
    video,
    remoteAudio,
    remoteVideo,
    audioVolume,
    errorCode,
  };
}
