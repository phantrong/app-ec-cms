import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import configs from 'config';
import { io, Socket } from 'socket.io-client';

import styles from './style.module.scss';
import { STATUS_CODE, STATUS_PAGE_MESSENGER, TOKEN_CMS, USER_KEY } from 'constants/constants';
import SpinLoading from 'components/SpinLoading';
import { useStoreDetail } from 'hooks/useUserChatManagement';
import { useUserDetail } from 'hooks/useListUsers';
import StoreMessengerListGroupChat from 'components/StoreMessengerListGroupChat';
import StoreMessengerBoxChat from 'components/StoreMessengerBoxChat';
import StoreMessengerGroupInfomation from 'components/StoreMessengerGroupInfomation';

export default function StoreChatManagement() {
  const { t } = useTranslation();
  const token = Cookies.get(TOKEN_CMS);
  const { storeId } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [listGroupChat, setListGroupChat] = useState<IGroupChatDetail[]>();
  const [activeUserId, setActiveUserId] = useState<number>();
  const [activeGroup, setActiveGroup] = useState<IGroupChatDetail>();
  const [pageStatus, setPageStatus] = useState<number>(STATUS_PAGE_MESSENGER.IN_LIST_GROUP_CHAT);
  const { data: storeProfile, isLoading: isLoadingProfileStore }: IStoreBasicDetailResponse = useStoreDetail(
    Number(storeId)
  );
  const { data: userProfile, isLoading: isLoadingUserProfile }: IUserDetailResponse = useUserDetail(activeUserId);
  const [newMessage, setNewMessage] = useState<IMessageDetail>();
  const [deletedMessageKeyId, setDeletedMessageId] = useState<string>();

  useEffect(() => {
    const socketIO = io((configs.WEB_SOCKET_DOMAIN || '') + '/chat-messenger', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: token,
          },
        },
      },
    });
    socketIO.on('chat-message', (data: IAddNewMessageParams) => {
      if (data) {
        setNewMessage({
          id: data.keyId,
          keyId: data.keyId,
          content: data.content,
          storeId: data.storeId,
          userId: data.userId,
          createdAt: data.time,
          deletedAt: null,
        });
      }
    });
    socketIO.on('delete-message-group', (messageId: string) => {
      if (messageId) {
        setDeletedMessageId(messageId);
      }
    });
    socketIO.on('exception', (err: IExceptionErrorResponse) => {
      if (err && err.errorCode === STATUS_CODE.HTTP_UNAUTHORIZED) {
        window.location.reload();
      }
    });
    setSocket(socketIO);
    return () => {
      socketIO.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (storeProfile && socket) {
      socket.emit('get-list-group-chat-of-store-for-cms', storeProfile.id, (response: IGroupChatDetail[]) => {
        setListGroupChat(response);
      });
    }
  }, [storeProfile, socket]);

  useEffect(() => {
    if (activeGroup && activeGroup.people[USER_KEY]?.userId) {
      const userId = activeGroup.people[USER_KEY].userId;
      if (userId) {
        setActiveUserId(userId);
      }
    }
  }, [activeGroup]);

  return (
    <div className={styles.storeChatManagement}>
      <Helmet>
        <title>{t('tabTitle.storeChatManagement')}</title>
      </Helmet>
      <Row justify="space-between" align="bottom" className={styles.content}>
        <Col
          xs={pageStatus === STATUS_PAGE_MESSENGER.IN_LIST_GROUP_CHAT ? 24 : 0}
          sm={pageStatus === STATUS_PAGE_MESSENGER.IN_LIST_GROUP_CHAT ? 24 : 0}
          md={7}
          lg={7}
          xl={7}
          className={styles.colListStore}
        >
          {storeProfile && (
            <StoreMessengerListGroupChat
              listGroupChat={listGroupChat || []}
              activeGroup={activeGroup}
              setActiveGroup={setActiveGroup}
              setPageStatus={setPageStatus}
              storeProfile={storeProfile}
              deletedMessageKeyId={deletedMessageKeyId}
              socket={socket}
            />
          )}
        </Col>
        <Col
          xs={pageStatus === STATUS_PAGE_MESSENGER.IN_BOX_CHAT ? 24 : 0}
          sm={pageStatus === STATUS_PAGE_MESSENGER.IN_BOX_CHAT ? 24 : 0}
          md={!!activeGroup && userProfile ? 12 : 17}
          lg={!!activeGroup && userProfile ? 12 : 17}
          xl={!!activeGroup && userProfile ? 12 : 17}
          className={styles.colBoxChat}
        >
          {(isLoadingUserProfile || isLoadingProfileStore) && <SpinLoading />}
          {storeProfile && (
            <StoreMessengerBoxChat
              storeProfile={storeProfile}
              activeGroup={activeGroup}
              pageStatus={pageStatus}
              setPageStatus={setPageStatus}
              newMessage={newMessage}
              userProfile={userProfile}
              setListGroupChat={setListGroupChat}
              deletedMessageKeyId={deletedMessageKeyId}
              socket={socket}
            />
          )}
        </Col>
        <Col
          xs={pageStatus === STATUS_PAGE_MESSENGER.IN_GROUP_INFORMATION ? 24 : 0}
          sm={pageStatus === STATUS_PAGE_MESSENGER.IN_GROUP_INFORMATION ? 24 : 0}
          md={!!activeGroup && userProfile ? 5 : 0}
          lg={!!activeGroup && userProfile ? 5 : 0}
          xl={!!activeGroup && userProfile ? 5 : 0}
          className={styles.colDetailStore}
        >
          {isLoadingUserProfile && <SpinLoading />}
          {userProfile && (
            <StoreMessengerGroupInfomation user={userProfile} pageStatus={pageStatus} setPageStatus={setPageStatus} />
          )}
        </Col>
      </Row>
    </div>
  );
}
