import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import configs from 'config';
import { io, Socket } from 'socket.io-client';

import styles from './style.module.scss';
import { STATUS_CODE, STATUS_PAGE_MESSENGER, STORE_KEY, TOKEN_CMS } from 'constants/constants';
import SpinLoading from 'components/SpinLoading';
import MessengerListGroupChat from 'components/MessengerListGroupChat';
import { useStoreDetail } from 'hooks/useUserChatManagement';
import MessengerGroupInfomation from 'components/MessengerGroupInfomation';
import MessengerBoxChat from 'components/MessengerBoxChat';
import { useUserDetail } from 'hooks/useListUsers';

export default function UserChatManagement() {
  const { t } = useTranslation();
  const token = Cookies.get(TOKEN_CMS);
  const { userId } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [listGroupChat, setListGroupChat] = useState<IGroupChatDetail[]>();
  const [activeStoreId, setActiveStoreId] = useState<number>();
  const [activeGroup, setActiveGroup] = useState<IGroupChatDetail>();
  const [pageStatus, setPageStatus] = useState<number>(STATUS_PAGE_MESSENGER.IN_LIST_GROUP_CHAT);
  const { data: storeDetail, isLoading: isLoadingDetailStore }: IStoreBasicDetailResponse =
    useStoreDetail(activeStoreId);
  const { data: userProfile, isLoading: isLoadingUserProfile }: IUserDetailResponse = useUserDetail(Number(userId));
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
    if (userProfile && socket) {
      socket.emit('get-list-group-chat-of-user-for-cms', userProfile.id, (response: IGroupChatDetail[]) => {
        setListGroupChat(response);
      });
    }
  }, [userProfile, socket]);

  useEffect(() => {
    if (activeGroup && activeGroup.people[STORE_KEY]?.storeId) {
      const storeId = activeGroup.people[STORE_KEY].storeId;
      if (storeId) {
        setActiveStoreId(storeId);
      }
    }
  }, [activeGroup]);

  return (
    <div className={styles.userChatManagement}>
      <Helmet>
        <title>{t('tabTitle.userChatManagement')}</title>
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
          {userProfile && (
            <MessengerListGroupChat
              listGroupChat={listGroupChat || []}
              activeGroup={activeGroup}
              setActiveGroup={setActiveGroup}
              setPageStatus={setPageStatus}
              userProfile={userProfile}
              deletedMessageKeyId={deletedMessageKeyId}
              socket={socket}
            />
          )}
        </Col>
        <Col
          xs={pageStatus === STATUS_PAGE_MESSENGER.IN_BOX_CHAT ? 24 : 0}
          sm={pageStatus === STATUS_PAGE_MESSENGER.IN_BOX_CHAT ? 24 : 0}
          md={!!activeGroup && storeDetail ? 12 : 17}
          lg={!!activeGroup && storeDetail ? 12 : 17}
          xl={!!activeGroup && storeDetail ? 12 : 17}
          className={styles.colBoxChat}
        >
          {isLoadingUserProfile && <SpinLoading />}
          {userProfile && (
            <MessengerBoxChat
              store={storeDetail}
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
          md={!!activeGroup && storeDetail ? 5 : 0}
          lg={!!activeGroup && storeDetail ? 5 : 0}
          xl={!!activeGroup && storeDetail ? 5 : 0}
          className={styles.colDetailStore}
        >
          {isLoadingDetailStore && <SpinLoading />}
          {storeDetail && (
            <MessengerGroupInfomation store={storeDetail} pageStatus={pageStatus} setPageStatus={setPageStatus} />
          )}
        </Col>
      </Row>
    </div>
  );
}
