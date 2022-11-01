import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useParams, useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { Modal, message as CMessage } from 'antd';
import { useIsFetching, useQueryClient } from 'react-query';
import { Helmet } from 'react-helmet-async';

import useAgora from 'hooks/useAgora';
import { useLiveStreamDetail } from 'hooks/useLiveStream';
import MediaPlayer from 'components/MediaPlayer';
import { IS_MOBILE_1024, ROLE, STATUS_LIST_LIVE, TOKEN_CMS } from 'constants/constants';
import configs from 'config';
import { GET_CMS_PROFILE } from 'constants/keyQuery';
import { formatCurrencyNumber, getDayWeek } from 'helper';
import useViewport from 'hooks/useViewPort';
import CommonURLImage from 'components/CommonURLImage';

import styles from './styles.module.scss';
// import micOnIcon from 'assets/images/icons/mic-on.svg';
// import micOffIcon from 'assets/images/icons/mic-off.svg';
import pauseIcon from 'assets/images/icons/pause.svg';
import playIcon from 'assets/images/icons/play.svg';
import volumnOnIcon from 'assets/images/icons/volumn-on.svg';
import volumnOffIcon from 'assets/images/icons/volumn-off.svg';
import zoomIcon from 'assets/images/icons/zoom.svg';
import defaultAvatar from 'assets/images/avatar.svg';
import zoomOutIcon from 'assets/images/icons/zoom-out-live.svg';
import LiveTime from 'components/LiveTime';

interface LiveInfoInterface {
  channel_name: string;
  token: string;
}

interface CommentInterface {
  content: string;
  createdAt: string;
  name: string;
  avatar?: string;
  storeId?: number;
  id: string;
  isDeleted?: boolean;
}

const { confirm } = Modal;

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'live', role: 'audience' });

const LiveStream = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [pauseImage, setPauseImage] = useState<string>('');
  const token = Cookies.get(TOKEN_CMS);
  // const location = useLocation();
  const queryClient = useQueryClient();

  const { id } = useParams();
  const [readyJoin, setReadyJoin] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [liveInfo, setLiveInfo] = useState<LiveInfoInterface | null>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [comments, setComments] = useState<CommentInterface[]>([]);
  const [newComment, setNewComment] = useState<CommentInterface | null>(null);
  const [isOffLiveStream, setIsOffLiveStream] = useState<boolean>(false);
  const [isEndLiveStream, setIsEndLiveStream] = useState<boolean>(false);
  const [connectNumber, setConnectNumber] = useState<null | number>(null);
  const [readyLive, setReadyLive] = useState<boolean>(false);
  const [profile, setProfile] = useState<undefined | ICmsProfile>();
  const [isShowComment, setIsShowComment] = useState<boolean>(false);
  const [isShowControl, setIsShowControl] = useState<boolean>(false);
  const [isZoom, setIsZoom] = useState<boolean>(false);

  const { width }: ViewPortInterface = useViewport();
  const isMobile = width < IS_MOBILE_1024;
  const videoRef = useRef<HTMLDivElement | null>(null);

  const { data: liveData, isLoading, isFetched }: LiveStreamDetailInterface = useLiveStreamDetail(id || '');
  const liveDetail = liveData?.data;

  const isFetching = useIsFetching({
    queryKey: [GET_CMS_PROFILE, !!token],
  });

  const {
    // localVideoTrack,
    leave,
    join,
    joinState,
    remoteUsers,
    // localAudioTrack,
    toggleRemoteAudio,
    toggleRemoteVideo,
    remoteAudio,
    remoteVideo,
    changeAudioVolume,
    audioVolume,
  } = useAgora(client);
  const [videoStyles, setVideoStyles] = useState<{ maxWidth: number; height: number }>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = () => {
    const containerWidth = document.querySelector('.video-container')?.clientWidth || 1280;
    // const containerHeight = document.querySelector('.video-container')?.clientHeight || 720;

    // if (containerWidth > containerHeight) {
    const height: number = Math.ceil((containerWidth * 720) / 1280);

    return setVideoStyles({
      maxWidth: containerWidth,
      height,
    });
    // }
    // const maxWidth: number = Math.ceil((containerHeight * 1280) / 720);

    // setVideoStyles({
    //   maxWidth: Math.min(maxWidth, (containerHeight * 1280) / 720),
    //   height: containerHeight,
    // });
  };

  // const handleRedirect = useCallback(
  //   (url, id?: string, state?: any) => {
  //     if (token) {
  //       if (state) return navigate(url, state);
  //       return id ? navigate(`${url}/${id}`) : navigate(url);
  //     }
  //   },
  //   [token, navigate]
  // );

  useLayoutEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    document.querySelector('.sidenav')?.setAttribute('style', 'display: none');
    return () => {
      window.removeEventListener('resize', handleResize);
      leave();
      document.querySelector('.sidenav')?.removeAttribute('style');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isOffLiveStream || isEndLiveStream) {
      leave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOffLiveStream, isEndLiveStream]);

  useEffect(() => {
    if (isFetching) return;
    const profileResponse: ICmsProfileResponse | undefined = queryClient.getQueryData([GET_CMS_PROFILE, !!token]);
    setProfile(profileResponse?.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, queryClient, token]);

  useEffect(() => {
    if (!liveDetail || !readyLive) return;
    const socket = io((configs.WEB_SOCKET_DOMAIN || '') + '/livestream', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `${new Date().getTime()}#${profile?.id}#${liveDetail.room_id}#${ROLE.CMS}`,
          },
        },
      },
    });
    socket.on('connect', () => {
      setConnectNumber(new Date().getTime());
    });
    socket.on('view', (view: number) => setViewCount(view));
    socket.on('comment', (comment: CommentInterface) => setNewComment(comment));
    socket.on('livestream-ended', () => setIsEndLiveStream(true));
    socket.on('cms-ended-livestream', () => setIsOffLiveStream(true));
    setSocket(socket);
    return () => {
      socket.off('connect');
      socket.off('view');
      socket.off('comment');
      socket.off('livestream-ended');
      socket.off('cms-ended-livestream');
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveDetail, readyLive, profile]);

  useEffect(() => {
    if (readyJoin && liveInfo?.channel_name && liveInfo.token) {
      join(liveInfo.channel_name, liveInfo.token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyJoin, liveInfo]);

  useEffect(() => {
    if (!liveDetail) return;
    if (liveDetail.status === STATUS_LIST_LIVE.LIVE_NOW) {
      return setReadyLive(true);
    }
    if (liveDetail.status === STATUS_LIST_LIVE.LIVE_SOON) {
      CMessage.info(t('live.error.notStart'));
      navigate('/live-streams');
    }
    // if (liveDetail.status === STATUS_LIST_LIVE.LIVE_END) {
    //   CMessage.info(t('live.error.ended'));
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveDetail]);
  const handleFullScreen = useCallback(() => {
    if (
      !document.fullscreenElement &&
      !(document as any).webkitIsFullScreen &&
      !(document as any).mozFullScreen &&
      !(document as any).msFullscreenElement
    ) {
      setIsZoom(false);
      handleResize();
    }
  }, [setIsZoom, handleResize]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreen, false);
    document.addEventListener('mozfullscreenchange', handleFullScreen, false);
    document.addEventListener('MSFullscreenChange', handleFullScreen, false);
    document.addEventListener('webkitfullscreenchange', handleFullScreen, false);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreen, false);
      document.removeEventListener('mozfullscreenchange', handleFullScreen, false);
      document.removeEventListener('MSFullscreenChange', handleFullScreen, false);
      document.removeEventListener('webkitfullscreenchange', handleFullScreen, false);
    };
  }, [handleFullScreen]);

  // useEffect(() => {
  //   if (!videoRef?.current) return;
  //   if (isZoom) {
  //     videoRef.current.requestFullscreen();
  //   } else if (document.fullscreenElement) {
  //     document.exitFullscreen();
  //   }
  // }, [isZoom, videoRef]);

  const handleZoom = () => {
    if (isZoom) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    } else {
      const requestFullScreen =
        videoRef.current?.requestFullscreen ||
        (videoRef.current as any).mozRequestFullScreen ||
        (videoRef.current as any).webkitRequestFullscreen ||
        (videoRef.current as any).msRequestFullscreen;
      requestFullScreen.call(videoRef.current);
      setTimeout(() => {
        handleResize();
      }, 200);
    }
    setIsZoom(!isZoom);
  };

  useEffect(() => {
    if (!isLoading && !liveDetail) {
      CMessage.info(t('live.error.notStart'));
      navigate('/live-streams');
    }
  }, [isLoading, liveDetail, navigate, t]);

  useEffect(() => {
    if (liveDetail?.room_id && liveDetail.status === STATUS_LIST_LIVE.LIVE_NOW) {
      setReadyJoin(true);
    }
  }, [liveDetail]);

  useEffect(() => {
    if (socket && connectNumber && liveDetail && readyLive) {
      socket.emit('join-room', liveDetail.room_id, (response: LiveInfoInterface) => {
        setLiveInfo(response);
      });
    }
  }, [socket, connectNumber, liveDetail, readyLive]);

  useEffect(() => {
    if (newComment) {
      setComments((comments) => [...comments, newComment]);
      setNewComment(null);
    }
  }, [newComment, comments]);

  useLayoutEffect(() => {
    if (!lastMessageRef.current) return;
    lastMessageRef.current.scrollIntoView({ block: 'end' });
  }, [comments, lastMessageRef]);

  useEffect(() => {
    if (joinState) {
      handleResize();
    }
  }, [joinState]);

  useEffect(() => {
    if (!comments.length || !socket) return;
    socket.on('comment-deleted', (response) => {
      setComments((comments) => comments.map((c) => (c.id === response ? { ...c, isDeleted: true } : c)));
    });
  }, [comments, socket, setComments]);

  // const onComment = useCallback(
  //   (message: string) => {
  //     if (!socket || !message || !profile || isOffLiveStream || !remoteUsers[0]) return;
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     socket.emit('comment', {
  //       message: message.trim(),
  //       time: new Date(),
  //       name: profile.surname + profile.name,
  //       avatar: profile.avatar,
  //     });
  //     setMessage('');
  //     document.querySelector('textarea')?.focus();
  //   },
  //   [socket, profile, isOffLiveStream, remoteUsers]
  // );

  const drawCanvas = () => {
    const video = document.querySelector('video');
    const canvas = document.createElement('canvas');
    if (canvas) {
      const context = canvas.getContext('2d');
      canvas.width = videoStyles?.maxWidth || 1280;
      canvas.height = videoStyles?.height || 720;
      if (context && video) {
        context.drawImage(video, 0, 0, videoStyles?.maxWidth || 1280, videoStyles?.height || 720);
      }
      const img = canvas.toDataURL();
      setPauseImage(img);
    }
  };

  const handleToggleVideo = () => {
    if (remoteVideo) {
      drawCanvas();
    } else {
      setPauseImage('');
    }
    toggleRemoteVideo();
  };

  const toggleControl = () => {
    if (!isMobile) return;
    setIsShowControl(!isShowControl);
  };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === 'Enter' || e.keyCode === 13) {
  //     if (!e.shiftKey) {
  //       // onComment(message);
  //       e.preventDefault();
  //     }
  //   }
  // };

  const handleEndLive = () => {
    if (!socket) return;
    confirm({
      title: <div>{t('live.endLiveConfirm')}</div>,
      okText: t('common.stop'),
      cancelText: t('common.cancel'),
      icon: <></>,
      className: 'modal-confirm-normal',
      centered: true,
      onOk() {
        socket.emit('cms-end-livestream');
      },
      onCancel() {},
    });
  };

  // custom styles can't be use types
  const volumnStyles: any = {
    '--buffered-width': `${remoteAudio ? audioVolume : 0}%`,
  };

  return (
    <div className={styles.liveContainer}>
      <Helmet>
        <title>{t('tabTitle.liveStream')}</title>
      </Helmet>
      <div className={styles.liveContent}>
        <div className={classNames({ [styles.videoContainer]: true, [styles.zoom]: isZoom })} ref={videoRef}>
          <div className={styles.videoContent}>
            <div onClick={toggleControl}>
              <MediaPlayer
                videoStyles={videoStyles}
                videoTrack={remoteUsers[0]?.videoTrack}
                audioTrack={remoteUsers[0]?.audioTrack}
                pauseImage={pauseImage}
                joinState={joinState}
                isZoom={isZoom}
                isOffLiveStream={isOffLiveStream}
                isEndLiveStream={isEndLiveStream}
              />
            </div>
            <div className={styles.controlContainer} style={{ ...volumnStyles, maxWidth: videoStyles?.maxWidth }}>
              <img
                src={remoteVideo ? pauseIcon : playIcon}
                alt="pause"
                className={styles.playIcon}
                onClick={handleToggleVideo}
              />
              <div
                className={classNames({
                  [styles.liveIcon]: true,
                  [styles.noCursor]: true,
                  [styles.off]: isOffLiveStream || !remoteUsers[0] || isEndLiveStream,
                })}
              ></div>
              <span className={styles.noCursor}>{t('live.living')}</span>
              <img
                src={remoteAudio && audioVolume > 0 ? volumnOnIcon : volumnOffIcon}
                alt="volumn"
                className={styles.volumn}
                onClick={toggleRemoteAudio}
              />
              <input
                type="range"
                id="volume-bar"
                min="0"
                max="1"
                step="0.1"
                className={styles.volumnInput}
                value={remoteAudio ? audioVolume / 100 : 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeAudioVolume(+e.target.value * 100)}
              />
              <img src={isZoom ? zoomOutIcon : zoomIcon} alt="zoom" onClick={handleZoom} />
            </div>
            {isMobile && isShowControl && (
              <img
                src={remoteVideo ? pauseIcon : playIcon}
                alt="pause"
                className={styles.playIcon}
                onClick={handleToggleVideo}
              />
            )}
          </div>
          {(!isMobile || !isShowComment) && (
            <div className={styles.liveDetail}>
              <div className={styles.title}>
                <b className={styles.liveTitle}>{liveDetail?.title}</b>
              </div>
              <div className={styles.createdAt}>
                {formatCurrencyNumber(viewCount)} {t('live.viewNo')}{' '}
                <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="3.5" cy="4" r="3.5" fill="#888888" />
                </svg>{' '}
                {t('live.startTime')} {isFetched && <LiveTime startTime={liveDetail?.time_passed || 0} />}
                {readyLive && (
                  <button
                    className={styles.endLive}
                    onClick={handleEndLive}
                    disabled={isOffLiveStream || isEndLiveStream}
                  >
                    {t('live.endLive')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        {(!isMobile || isShowComment) && (
          <div className={styles.chatContainer}>
            <div className={styles.chatBox}>
              <div className={styles.chatHeader}>
                {t('live.comment')}
                {isMobile && (
                  <div className={styles.closeChatBox} onClick={() => setIsShowComment(false)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 15L14.9999 5.00008"
                        stroke="#3B3B3B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.9999 14.9999L5 5"
                        stroke="#3B3B3B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className={styles.chatBody}>
                {comments.slice(-50).map((comment, index) => (
                  <div className={styles.message} key={index}>
                    <div className={styles.avatar}>
                      {!comment.isDeleted && (
                        <img className={styles.avatar} src={comment.avatar || defaultAvatar} alt="avatar user" />
                      )}
                    </div>
                    <div className={styles.messageInfo}>
                      {comment.isDeleted ? (
                        <div className={styles.commentDeleted}>{t('live.commentDeleted')}</div>
                      ) : (
                        <>
                          <div className={styles.userName}>
                            <div className={comment.storeId ? styles.shopName : ''}>
                              {comment.storeId ? liveDetail?.store?.name : comment.name}{' '}
                              {comment.storeId ? <span className={styles.isStore}>{t('live.isStore')}</span> : null}
                            </div>
                          </div>
                          <div className={styles.messageContent}>{comment.content}</div>
                        </>
                      )}
                    </div>
                    {!comment.isDeleted && (
                      <div className={styles.time}>{dayjs(comment.createdAt).format('HH:mm')}</div>
                    )}
                  </div>
                ))}
                <div ref={lastMessageRef} />
              </div>
            </div>
          </div>
        )}
      </div>
      {(!isMobile || !isShowComment) && (
        <div className={styles.liveInfo}>
          <div className={styles.storeInfo}>
            <div className={styles.storeAvatar}>
              {/* <img src={liveDetail?.store?.avatar || undefined} alt="store" width={70} height={70} /> */}
              <CommonURLImage src={liveDetail?.store?.avatar} alt="store" />
            </div>
            <div>
              <div className={styles.storeName}>{liveDetail?.store?.name}</div>
              <div className={styles.buttons}>
                <button>
                  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.5 6.25V11.35C22.5 12.62 22.08 13.69 21.33 14.43C20.59 15.18 19.52 15.6 18.25 15.6V17.41C18.25 18.09 17.49 18.5 16.93 18.12L15.96 17.48C16.05 17.17 16.09 16.83 16.09 16.47V12.4C16.09 10.36 14.73 9 12.69 9H5.89999C5.75999 9 5.63 9.01002 5.5 9.02002V6.25C5.5 3.7 7.2 2 9.75 2H18.25C20.8 2 22.5 3.7 22.5 6.25Z"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.09 12.4V16.47C16.09 16.83 16.05 17.17 15.96 17.48C15.59 18.95 14.37 19.87 12.69 19.87H9.97L6.95 21.88C6.5 22.19 5.89999 21.86 5.89999 21.32V19.87C4.87999 19.87 4.03 19.53 3.44 18.94C2.84 18.34 2.5 17.49 2.5 16.47V12.4C2.5 10.5 3.68 9.19002 5.5 9.02002C5.63 9.01002 5.75999 9 5.89999 9H12.69C14.73 9 16.09 10.36 16.09 12.4Z"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t('storeDetail.chat')}
                </button>
                <button>
                  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.5 2V5"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.5 2V5"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 9.09009H21"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.71 15.77L16.1701 19.31C16.0301 19.45 15.9 19.71 15.87 19.9L15.68 21.25C15.61 21.74 15.95 22.0801 16.44 22.0101L17.79 21.82C17.98 21.79 18.25 21.66 18.38 21.52L21.9201 17.9801C22.5301 17.3701 22.8201 16.6601 21.9201 15.7601C21.0301 14.8701 20.32 15.16 19.71 15.77Z"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.2002 16.28C19.5002 17.36 20.3402 18.2 21.4202 18.5"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.5 22H8.5C5 22 3.5 20 3.5 17V8.5C3.5 5.5 5 3.5 8.5 3.5H16.5C20 3.5 21.5 5.5 21.5 8.5V12"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.4955 13.7H12.5045"
                      stroke="#3B3B3B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.79431 13.7H8.80329"
                      stroke="#3B3B3B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.79431 16.7H8.80329"
                      stroke="#3B3B3B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t('storeDetail.booking')}
                </button>
              </div>
            </div>
          </div>
          <div className={styles.storeContact}>
            <div className={styles.storeContactItem}>
              <dt>
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18.3087 15.7751C18.3087 16.0751 18.242 16.3834 18.1003 16.6834C17.9587 16.9834 17.7753 17.2667 17.5337 17.5334C17.1253 17.9834 16.6753 18.3084 16.167 18.5167C15.667 18.7251 15.1253 18.8334 14.542 18.8334C13.692 18.8334 12.7837 18.6334 11.8253 18.2251C10.867 17.8167 9.90866 17.2667 8.95866 16.5751C8.00033 15.8751 7.09199 15.1001 6.22533 14.2417C5.36699 13.3751 4.59199 12.4667 3.90033 11.5167C3.21699 10.5667 2.66699 9.61675 2.26699 8.67508C1.86699 7.72508 1.66699 6.81675 1.66699 5.95008C1.66699 5.38341 1.76699 4.84175 1.96699 4.34175C2.16699 3.83341 2.48366 3.36675 2.92533 2.95008C3.45866 2.42508 4.04199 2.16675 4.65866 2.16675C4.89199 2.16675 5.12533 2.21675 5.33366 2.31675C5.55033 2.41675 5.74199 2.56675 5.89199 2.78341L7.82533 5.50842C7.97533 5.71675 8.08366 5.90841 8.15866 6.09175C8.23366 6.26675 8.27533 6.44175 8.27533 6.60008C8.27533 6.80008 8.21699 7.00008 8.10033 7.19175C7.99199 7.38341 7.83366 7.58341 7.63366 7.78341L7.00033 8.44175C6.90866 8.53341 6.86699 8.64175 6.86699 8.77508C6.86699 8.84175 6.87533 8.90008 6.89199 8.96675C6.91699 9.03341 6.94199 9.08341 6.95866 9.13341C7.10866 9.40841 7.36699 9.76675 7.73366 10.2001C8.10866 10.6334 8.50866 11.0751 8.94199 11.5167C9.39199 11.9584 9.82533 12.3667 10.267 12.7417C10.7003 13.1084 11.0587 13.3584 11.342 13.5084C11.3837 13.5251 11.4337 13.5501 11.492 13.5751C11.5587 13.6001 11.6253 13.6084 11.7003 13.6084C11.842 13.6084 11.9503 13.5584 12.042 13.4667L12.6753 12.8417C12.8837 12.6334 13.0837 12.4751 13.2753 12.3751C13.467 12.2584 13.6587 12.2001 13.867 12.2001C14.0253 12.2001 14.192 12.2334 14.3753 12.3084C14.5587 12.3834 14.7503 12.4917 14.9587 12.6334L17.717 14.5917C17.9337 14.7417 18.0837 14.9167 18.1753 15.1251C18.2587 15.3334 18.3087 15.5417 18.3087 15.7751Z"
                    stroke="#3B3B3B"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                  />
                </svg>
                <span>{liveDetail?.store?.phone}</span>
              </dt>
              <dd className={styles.longAddRess}>
                <span>
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.0004 11.6917C11.4363 11.6917 12.6004 10.5276 12.6004 9.0917C12.6004 7.65576 11.4363 6.4917 10.0004 6.4917C8.56445 6.4917 7.40039 7.65576 7.40039 9.0917C7.40039 10.5276 8.56445 11.6917 10.0004 11.6917Z"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3.01675 7.57508C4.65842 0.358417 15.3501 0.36675 16.9834 7.58342C17.9417 11.8167 15.3084 15.4001 13.0001 17.6168C11.3251 19.2334 8.67508 19.2334 6.99175 17.6168C4.69175 15.4001 2.05842 11.8084 3.01675 7.57508Z"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span className={styles.longContent}>{liveDetail?.store?.address}</span>
                </span>
              </dd>
            </div>
            <div className={styles.storeContactItem}>
              <dt>
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.66699 2.16675V4.66675"
                    stroke="#3B3B3B"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.333 2.16675V4.66675"
                    stroke="#3B3B3B"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.91699 8.07495H17.0837"
                    stroke="#3B3B3B"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 7.58341V14.6667C17.5 17.1667 16.25 18.8334 13.3333 18.8334H6.66667C3.75 18.8334 2.5 17.1667 2.5 14.6667V7.58341C2.5 5.08341 3.75 3.41675 6.66667 3.41675H13.3333C16.25 3.41675 17.5 5.08341 17.5 7.58341Z"
                    stroke="#3B3B3B"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.99607 11.9167H10.0036"
                    stroke="#3B3B3B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.91209 11.9167H6.91957"
                    stroke="#3B3B3B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.91209 14.4167H6.91957"
                    stroke="#3B3B3B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{getDayWeek(liveDetail?.store?.work_day)}</span>
              </dt>
              <dd>
                <span>
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18.3337 10.5001C18.3337 15.1001 14.6003 18.8334 10.0003 18.8334C5.40033 18.8334 1.66699 15.1001 1.66699 10.5001C1.66699 5.90008 5.40033 2.16675 10.0003 2.16675C14.6003 2.16675 18.3337 5.90008 18.3337 10.5001Z"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.0914 13.15L10.5081 11.6083C10.0581 11.3416 9.69141 10.7 9.69141 10.175V6.7583"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {liveDetail?.store?.time_start} - {liveDetail?.store?.time_end}
                  </span>
                </span>
                <span>
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.6416 6.7002L9.99992 10.9585L17.3082 6.72517"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 18.5085V10.9502"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.27453 2.56675L3.82453 5.04177C2.8162 5.60011 1.99121 7.00009 1.99121 8.15009V12.8584C1.99121 14.0084 2.8162 15.4084 3.82453 15.9668L8.27453 18.4418C9.22453 18.9668 10.7829 18.9668 11.7329 18.4418L16.1829 15.9668C17.1912 15.4084 18.0162 14.0084 18.0162 12.8584V8.15009C18.0162 7.00009 17.1912 5.60011 16.1829 5.04177L11.7329 2.56675C10.7745 2.03341 9.22453 2.03341 8.27453 2.56675Z"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.1671 11.5334V8.48345L6.25879 3.91675"
                      stroke="#3B3B3B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{liveDetail?.store?.products_count}</span>
                </span>
              </dd>
            </div>
          </div>
        </div>
      )}
      {isMobile && !isShowComment && (
        <div className={styles.commentbtn} onClick={() => setIsShowComment(true)}>
          {t('live.comment')}
          <svg width="10" height="21" viewBox="0 0 10 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2264_76733)">
              <path
                d="M7.83061 3.71939C8.2421 4.44108 8.56174 5.00167 8.76909 5.45695C8.97723 5.91393 9.09476 6.31061 9.05473 6.69633C8.99118 7.3085 8.67399 7.86579 8.18033 8.22897C7.86851 8.45837 7.4683 8.55388 6.97283 8.59991C6.47934 8.64576 5.83973 8.64575 5.01715 8.64575L4.98287 8.64575C4.16029 8.64575 3.52068 8.64576 3.02719 8.59991C2.53172 8.55388 2.1315 8.45837 1.81969 8.22897C1.32603 7.8658 1.00883 7.3085 0.945289 6.69633C0.905251 6.31061 1.02279 5.91393 1.23092 5.45695C1.43828 5.00167 1.75791 4.44109 2.1694 3.71941L2.1861 3.69011C2.59757 2.96847 2.91721 2.40787 3.20295 1.99834C3.4895 1.58765 3.77072 1.28492 4.12282 1.12619C4.6811 0.874497 5.31891 0.874497 5.8772 1.12619C6.22929 1.28492 6.51051 1.58765 6.79707 1.99834C7.08281 2.40787 7.40245 2.96847 7.81391 3.69012L7.83061 3.71939Z"
                fill="#3B3B3B"
                stroke="#3B3B3B"
                strokeWidth="1.5"
              />
            </g>
            <g clipPath="url(#clip1_2264_76733)">
              <path
                d="M7.83061 17.2806C8.2421 16.5589 8.56174 15.9983 8.76909 15.5431C8.97723 15.0861 9.09476 14.6894 9.05473 14.3037C8.99118 13.6915 8.67399 13.1342 8.18033 12.771C7.86851 12.5416 7.4683 12.4461 6.97283 12.4001C6.47934 12.3542 5.83973 12.3542 5.01715 12.3542L4.98287 12.3542C4.16029 12.3542 3.52068 12.3542 3.02719 12.4001C2.53172 12.4461 2.1315 12.5416 1.81969 12.771C1.32603 13.1342 1.00883 13.6915 0.945289 14.3037C0.905251 14.6894 1.02279 15.0861 1.23092 15.5431C1.43828 15.9983 1.75791 16.5589 2.1694 17.2806L2.1861 17.3099C2.59757 18.0315 2.91721 18.5921 3.20295 19.0017C3.4895 19.4123 3.77072 19.7151 4.12282 19.8738C4.6811 20.1255 5.31891 20.1255 5.8772 19.8738C6.22929 19.7151 6.51051 19.4123 6.79707 19.0017C7.08281 18.5921 7.40245 18.0315 7.81391 17.3099L7.83061 17.2806Z"
                fill="#3B3B3B"
                stroke="#3B3B3B"
                strokeWidth="1.5"
              />
            </g>
            <defs>
              <clipPath id="clip0_2264_76733">
                <rect width="10" height="10" fill="white" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 10 10)" />
              </clipPath>
              <clipPath id="clip1_2264_76733">
                <rect width="10" height="10" fill="white" transform="translate(10 11) rotate(90)" />
              </clipPath>
            </defs>
          </svg>
        </div>
      )}
    </div>
  );
};

export default LiveStream;
