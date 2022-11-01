import { Button, Col, Modal, Popover, Row } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './styles.module.scss';
import { DEFAULT_PAGE_ANTD, PRIVATE_GROUP_CHAT_TYPE, STATUS_PAGE_MESSENGER } from 'constants/constants';
import { checkLinkProductDetail, compareTimeWithHourMessenger, isToday, showTimeChatMessenger } from 'helper/index';
import SpinLoading from 'components/SpinLoading';
import MessengerLinkProduct from 'components/MessengerLinkProduct';
import CommonURLImage from 'components/CommonURLImage';
import { useGetGroupChatInformation } from 'hooks/useUserChatManagement';

import messengerBackground from '../../assets/images/background-messenger.svg';
import backLeft from '../../assets/images/icons/icon-arrow-left-back.svg';
import moreIcon from '../../assets/images/icons/more.svg';
import clearIcon from 'assets/images/icons/icon-x.svg';
import userGroup from 'assets/images/icons/profile-2user.svg';

const StoreMessengerBoxChat = (props: IStoreMessengerBoxChatProps) => {
  const { t } = useTranslation();
  const {
    activeGroup,
    userProfile,
    pageStatus,
    setPageStatus,
    newMessage,
    storeProfile,
    setListGroupChat,
    deletedMessageKeyId,
    socket,
  } = props;
  const [listDataMessage, setListDataMessage] = useState<IDataResponseHistoryChatMessenger>();
  const [isLoadingDeleteMessage, setIsLoadingDeleteMessage] = useState<boolean>(false);
  const [isModalDeleteMessageVisible, setIsModalDeleteMessageVisible] = useState<boolean>(false);
  const [deleteMessageKeyId, setDeleteMessageKeyId] = useState<string>('');
  const wrapperRef = useRef<null | HTMLDivElement>(null);
  const [isScroll, setIsScroll] = useState<boolean>(true);
  const [pageFilter, setPageFilter] = useState<IHistoryChatFilter>({
    page: DEFAULT_PAGE_ANTD,
  });
  const [listMessage, setListMessage] = useState<IMessageDetail[]>([]);
  const [totalMessage, setTotalMessage] = useState<number>(listDataMessage?.total || 0);
  const [isUserGroupModalVisible, setIsUserGroupModalVisible] = useState<boolean>(false);
  const arrayStoreIds = Object.keys(activeGroup?.audience?.store || {});
  const arrayUserIds = Object.keys(activeGroup?.audience?.user || {});
  const { data: groupChatData, isLoading: isLoadingGroupChatData }: IGetGroupChatInformationDataResponse =
    useGetGroupChatInformation({
      store: arrayStoreIds,
      user: arrayUserIds,
    });

  useEffect(() => {
    if (activeGroup && storeProfile && userProfile && socket) {
      setPageFilter({
        page: DEFAULT_PAGE_ANTD,
      });
      socket.emit('join-group', activeGroup._id, (response: IDataResponseHistoryChatMessenger[]) => {
        if (!!response.length) {
          setListMessage(response[0].messages);
          setTotalMessage(response[0].total);
        } else {
          setListMessage([]);
          setTotalMessage(0);
        }
      });
      setIsScroll(true);
    }
  }, [activeGroup, storeProfile, userProfile, socket]);

  useEffect(() => {
    if (socket && pageFilter.page !== DEFAULT_PAGE_ANTD && activeGroup) {
      const params: IGetHistoryChatParams = {
        groupId: activeGroup._id || '',
        page: pageFilter.page,
      };
      socket.emit('get-history-chat-for-cms', params, (response: IDataResponseHistoryChatMessenger[]) => {
        setListDataMessage(response[0]);
        setIsScroll(false);
      });
    }
    // eslint-disable-next-line
  }, [pageFilter.page]);

  const scrollToView = () => wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });

  const hanldeBackListGroupChat = () => setPageStatus(STATUS_PAGE_MESSENGER.IN_LIST_GROUP_CHAT);
  const hanldeViewGroupInformation = () => setPageStatus(STATUS_PAGE_MESSENGER.IN_GROUP_INFORMATION);

  const handleSubmitModalDeleteMessage = useCallback(() => {
    if (socket) {
      setIsLoadingDeleteMessage(true);
      const params: IDeleteMessageChatParams = {
        messageKeyId: deleteMessageKeyId,
        storeId: storeProfile.id,
      };
      socket.emit('delete-message-group-for-cms', params);
      setListMessage((prevState: IMessageDetail[]) => {
        const dataTemp: IMessageDetail[] = [...prevState];
        dataTemp.forEach((message: IMessageDetail) => {
          if (message.keyId === deleteMessageKeyId) {
            message.deletedAt = dayjs().format();
            return false;
          }
        });
        return dataTemp;
      });
      setListGroupChat((prevState?: IGroupChatDetail[]) => {
        const dataTemp: IGroupChatDetail[] = [...(prevState || [])];
        dataTemp.forEach((group: IGroupChatDetail, index: number) => {
          if (group._id === activeGroup?._id) {
            const tempGroup: IGroupChatDetail = group;
            if (tempGroup.messages && !!tempGroup.messages.length) {
              if (tempGroup.messages[0].keyId === deleteMessageKeyId) {
                tempGroup.messages[0].deletedAt = dayjs().format();
              }
            }
            dataTemp.splice(index, 1);
            dataTemp.unshift(tempGroup);
            return false;
          }
        });
        return dataTemp;
      });
      setIsLoadingDeleteMessage(false);
      setIsModalDeleteMessageVisible(false);
    }
  }, [deleteMessageKeyId, activeGroup, setListGroupChat, socket, storeProfile]);

  const handleCancelModalDeleteMessage = useCallback(() => {
    setIsModalDeleteMessageVisible(false);
  }, []);

  const handleDeleteMsg = useCallback((messageKeyId: string) => {
    if (messageKeyId) {
      setDeleteMessageKeyId(messageKeyId);
      setIsModalDeleteMessageVisible(true);
    }
  }, []);

  useEffect(() => {
    if (newMessage) {
      setListMessage((prevState: IMessageDetail[]) => {
        const dataTemp: IMessageDetail[] = [...prevState];
        dataTemp.unshift(newMessage);
        return dataTemp;
      });
      setIsScroll(true);
    }
  }, [newMessage]);

  useEffect(() => {
    if (deletedMessageKeyId) {
      setListMessage((prevState: IMessageDetail[]) => {
        const dataTemp: IMessageDetail[] = [...prevState];
        dataTemp.forEach((message: IMessageDetail) => {
          if (message.keyId === deletedMessageKeyId) {
            message.deletedAt = new Date().toISOString();
            return false;
          }
        });
        return dataTemp;
      });
    }
  }, [deletedMessageKeyId]);

  useEffect(() => {
    setListMessage([...listMessage, ...[...(listDataMessage?.messages || [])]]);
    setTotalMessage(listDataMessage?.total || 0);
    // eslint-disable-next-line
  }, [listDataMessage]);

  useEffect(() => {
    if (isScroll) {
      scrollToView();
    }
  }, [listMessage, isScroll]);

  return (
    <div className={styles.boxMessenger}>
      <Row className={styles.rowBoxChat}>
        {!activeGroup?._id && (
          <Col span={24} className={styles.backgroundHello}>
            <strong>{t('userChatManagement.hello')}</strong>
            <img height={441} width={424} src={messengerBackground} alt="Background" />
          </Col>
        )}
        {!!activeGroup?._id && userProfile && (
          <Col span={24} className={styles.colBoxChat}>
            <Col span={24} className={styles.colStore}>
              <div className={styles.infoStore}>
                {pageStatus && (
                  <img
                    height={38}
                    width={24}
                    src={backLeft}
                    alt="backLeft"
                    onClick={hanldeBackListGroupChat}
                    className={styles.backLeft}
                  />
                )}
                <CommonURLImage
                  src={userProfile.avatar}
                  alt="Store"
                  className={styles.avatar}
                  handleOnClick={hanldeViewGroupInformation}
                />
                <strong onClick={hanldeViewGroupInformation}>{userProfile.surname + userProfile.name}</strong>
              </div>
              {groupChatData && (
                <Button className={styles.btnBooking} onClick={() => setIsUserGroupModalVisible(true)}>
                  <img height={24} width={24} src={userGroup} alt="userGroup" />
                  {arrayStoreIds.length + arrayUserIds.length}
                </Button>
              )}
            </Col>
            <Col span={24} className={styles.boxChat}>
              <div id="scrollableDiv" className={styles.divInfiniteScroll}>
                <div ref={wrapperRef} />
                <InfiniteScroll
                  dataLength={listMessage.length}
                  next={() => {
                    setPageFilter({
                      page: pageFilter.page + 1,
                    });
                  }}
                  className={styles.messageInfiniteScroll}
                  inverse={true}
                  hasMore={listMessage.length < totalMessage}
                  loader={
                    <div className={styles.loading}>
                      <SpinLoading />
                    </div>
                  }
                  scrollableTarget="scrollableDiv"
                >
                  {listMessage.map((item: IMessageDetail, index: number) => (
                    <Col
                      span={24}
                      className={classNames({
                        [styles.myMsg]: item.storeId === storeProfile.id,
                        [styles.storeMsg]: item.storeId !== storeProfile.id,
                      })}
                      key={item.id}
                    >
                      {index + 1 === listMessage.length && (
                        <span className={styles.time}>
                          {showTimeChatMessenger(t('userChatManagement.yesterday'), item.createdAt)}
                        </span>
                      )}
                      {index + 1 !== listMessage.length &&
                        isToday(item.createdAt) &&
                        compareTimeWithHourMessenger(item.createdAt, listMessage[index + 1].createdAt) && (
                          <span className={styles.time}>
                            {showTimeChatMessenger(t('userChatManagement.yesterday'), item.createdAt)}
                          </span>
                        )}
                      {index + 1 !== listMessage.length &&
                        !isToday(item.createdAt) &&
                        dayjs(item.createdAt).date() !== dayjs(listMessage[index + 1].createdAt).date() && (
                          <span className={styles.time}>
                            {showTimeChatMessenger(t('userChatManagement.yesterday'), item.createdAt)}
                          </span>
                        )}
                      {(!!item.userId || item.storeId !== storeProfile.id) &&
                        ((listMessage[index + 1] &&
                          (!!listMessage[index + 1].storeId || listMessage[index + 1].userId !== item.userId)) ||
                          index === listMessage.length - 1) && (
                          <span className={styles.nameStore}>
                            {activeGroup.type === PRIVATE_GROUP_CHAT_TYPE
                              ? userProfile?.surname + userProfile?.name
                              : item.name}
                          </span>
                        )}
                      {(!!item.userId || item.storeId !== storeProfile.id) && (
                        <div className={styles.messageHasAvatar}>
                          <div className={styles.divAvatar}>
                            {((listMessage[index - 1] &&
                              (!!listMessage[index - 1].storeId || listMessage[index - 1].userId !== item.userId)) ||
                              index === 0) && (
                              <CommonURLImage
                                className={styles.avatarStore}
                                src={activeGroup.type === PRIVATE_GROUP_CHAT_TYPE ? userProfile?.avatar : item.avatar}
                                alt="User"
                              />
                            )}
                          </div>
                          {!item.deletedAt && (
                            <span className={styles.message}>
                              {checkLinkProductDetail(item.content) === 0 ? (
                                item.content
                              ) : (
                                <MessengerLinkProduct productId={checkLinkProductDetail(item.content)} />
                              )}
                            </span>
                          )}
                          {item.deletedAt && (
                            <span className={styles.deletedMsg}>{t('userChatManagement.deletedMsg')}</span>
                          )}
                        </div>
                      )}
                      {item.storeId === storeProfile.id && (
                        <Popover
                          getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
                          placement="left"
                          content={
                            <Popover
                              getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
                              placement="top"
                              content={
                                <span className={styles.btnDeleteMsg} onClick={() => handleDeleteMsg(item.keyId)}>
                                  {t('userChatManagement.deleteMsg')}
                                </span>
                              }
                              trigger="click"
                              overlayClassName={styles.popoverDeleteMsg}
                            >
                              <img height={24} width={24} className={styles.more} src={moreIcon} alt="More" />
                            </Popover>
                          }
                          trigger={['hover', 'contextMenu']}
                          overlayClassName={styles.popoverMore}
                        >
                          <div className={styles.myMessage}>
                            {!item.deletedAt && (
                              <div className={styles.message}>
                                {checkLinkProductDetail(item.content) === 0 ? (
                                  item.content
                                ) : (
                                  <MessengerLinkProduct productId={checkLinkProductDetail(item.content)} />
                                )}
                              </div>
                            )}
                            {item.deletedAt && (
                              <span className={styles.deletedMsg}>{t('userChatManagement.deletedMsg')}</span>
                            )}
                          </div>
                        </Popover>
                      )}
                    </Col>
                  ))}
                </InfiniteScroll>
              </div>
            </Col>
            <Modal
              className={styles.modalYesNo}
              visible={isModalDeleteMessageVisible}
              closable={false}
              centered={true}
              footer={false}
            >
              <div className={styles.title}>
                <strong>{t('userChatManagement.titleModalDeleteMsg1')}</strong>
                <strong>{t('userChatManagement.titleModalDeleteMsg2')}</strong>
              </div>
              <div className={styles.button}>
                <Button
                  type="primary"
                  htmlType="button"
                  onClick={handleCancelModalDeleteMessage}
                  className={styles.buttonCancel}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="primary"
                  htmlType="button"
                  onClick={handleSubmitModalDeleteMessage}
                  className={styles.buttonOk}
                  loading={isLoadingDeleteMessage}
                >
                  {t('common.ok')}
                </Button>
              </div>
            </Modal>
            <Modal
              className={styles.userGroupModal}
              visible={isUserGroupModalVisible}
              closable={false}
              centered={true}
              footer={false}
            >
              <div className={styles.title}>
                <div className={styles.titleGroup}>
                  <strong>{t('userChatManagement.titleModalGroup')}</strong>(
                  {arrayStoreIds.length + arrayUserIds.length})
                </div>
                <div className={styles.clearIcon}>
                  <img src={clearIcon} alt="clear" onClick={() => setIsUserGroupModalVisible(false)} />
                </div>
              </div>
              {isLoadingGroupChatData && <SpinLoading />}
              {groupChatData && (
                <div className={styles.list}>
                  {groupChatData.map((people: IPeopleInGroupChat) => (
                    <div className={styles.divUser}>
                      <CommonURLImage className={styles.avatar} src={people.avatar} alt="avatar" />
                      <div className={styles.userName}>{people.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </Modal>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default StoreMessengerBoxChat;
