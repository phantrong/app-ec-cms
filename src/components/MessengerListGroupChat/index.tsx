import { Col, Input, Row } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';
import { showTimeChatMessenger, trimSpaceInput } from 'helper/index';
import {
  PRIVATE_GROUP_CHAT_TYPE,
  PUBLIC_GROUP_CHAT_TYPE,
  STATUS_PAGE_MESSENGER,
  STORE_KEY,
  USER_KEY,
} from 'constants/constants';
import CommonURLImage from 'components/CommonURLImage';

import listGroupChatEmpty from '../../assets/images/background-list-store-empty.svg';
import searchIcon from '../../assets/images/icons/icon-search-normal.svg';
import notHaveStore from '../../assets/images/background-dont-have-store.svg';
import backLeft from '../../assets/images/icons/icon-back-left.svg';
import defaultAvatar from 'assets/images/avatar.svg';

const SearchIcon = () => <img height={20} width={20} src={searchIcon} alt="Search Icon" />;

const MessengerListGroupChat = (props: IMessengerListGroupChatProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { listGroupChat, activeGroup, setActiveGroup, setPageStatus, userProfile, deletedMessageKeyId, socket } = props;
  const [nameSearch, setNameSearch] = useState<string>('');
  const [listGroup, setListGroup] = useState<IGroupChatDetail[]>(listGroupChat);

  useEffect(() => {
    if (socket) {
      socket.on('new-message', (data: IDataResponseNewMessage) => {
        if (data && data.user.userId === userProfile.id) {
          const now = new Date().toISOString();
          const newMsg: IMessageDetail = {
            id: data.message.keyId,
            keyId: data.message.keyId,
            userId: data.message.userId,
            storeId: data.message.storeId,
            content: data.message.content,
            createdAt: now,
            deletedAt: null,
          };
          let isHadGroup = false;
          setListGroup((prevState?: IGroupChatDetail[]) => {
            const dataTemp: IGroupChatDetail[] = [...(prevState || [])];
            dataTemp.forEach((group: IGroupChatDetail, index: number) => {
              if (data.groupId === group._id) {
                const tempGroup: IGroupChatDetail = group;
                tempGroup.updateAt = now;
                if (data.groupId !== activeGroup?._id) {
                  tempGroup.read = [USER_KEY];
                } else {
                  tempGroup.read = [];
                }
                tempGroup.messages?.unshift(newMsg);
                dataTemp.splice(index, 1);
                dataTemp.unshift(tempGroup);
                isHadGroup = true;
                return false;
              }
            });
            return dataTemp;
          });
          if (!isHadGroup) {
            if (userProfile) {
              setListGroup((prevState?: IGroupChatDetail[]) => {
                const dataTemp: IGroupChatDetail[] = [...(prevState || [])];
                const newGroup: IGroupChatDetail = {
                  _id: data.groupId,
                  type: PRIVATE_GROUP_CHAT_TYPE,
                  read: [USER_KEY],
                  updateAt: now,
                  people: [
                    {
                      avatar: data.store.avatar,
                      name: data.store.name,
                      storeId: data.store.storeId,
                    },
                    {
                      avatar: userProfile.avatar || '',
                      name: userProfile.surname + userProfile.name,
                      userId: userProfile.id,
                    },
                  ],
                  messages: [newMsg],
                };
                dataTemp.unshift(newGroup);
                return dataTemp;
              });
            }
          }
        }
      });
    }
  }, [activeGroup, userProfile, socket]);

  useEffect(() => {
    if (deletedMessageKeyId) {
      setListGroup((prevState?: IGroupChatDetail[]) => {
        const dataTemp: IGroupChatDetail[] = [...(prevState || [])];
        dataTemp.forEach((group: IGroupChatDetail) => {
          if (group.messages && !!group.messages.length && group.messages[0].keyId === deletedMessageKeyId) {
            group.messages[0].deletedAt = new Date().toISOString();
            return false;
          }
        });
        return dataTemp;
      });
    }
  }, [deletedMessageKeyId]);

  const handleTrimSpaceInput = useCallback((e: React.FocusEvent<HTMLInputElement, Element>) => {
    setNameSearch(trimSpaceInput(e.target.value));
  }, []);

  const handleChangeStoreActive = useCallback(
    (groupChat: IGroupChatDetail) => {
      setActiveGroup(groupChat);
      setPageStatus(STATUS_PAGE_MESSENGER.IN_BOX_CHAT);
    },
    [setActiveGroup, setPageStatus]
  );

  const boxGroupChat = useMemo(() => {
    return listGroup?.map((item: IGroupChatDetail) => (
      <Col
        span={24}
        className={classNames({
          [styles.boxStore]: true,
          [styles.boxStoreActive]: item._id === activeGroup?._id,
        })}
        key={item._id}
        onClick={() => handleChangeStoreActive(item)}
      >
        {item.type === PRIVATE_GROUP_CHAT_TYPE && (
          <CommonURLImage src={item.people[STORE_KEY]?.avatar || defaultAvatar} className={styles.avatar} alt="Store" />
        )}
        {item.type === PUBLIC_GROUP_CHAT_TYPE && (
          <div className={styles.avatarGroup}>
            <div className={styles.avatarShop}>
              <CommonURLImage
                src={item.people[STORE_KEY]?.avatar || defaultAvatar}
                className={styles.avatar}
                alt="Store"
              />
            </div>
            <div className={styles.avatarUser}>
              <CommonURLImage
                src={item.people[USER_KEY]?.avatar || defaultAvatar}
                className={styles.avatar}
                alt="User"
              />
            </div>
          </div>
        )}
        <div className={styles.chatInfo}>
          <div className={styles.nameStore}>
            <span>
              {item.people[STORE_KEY]?.name}
              {item.type === PUBLIC_GROUP_CHAT_TYPE && `, ${item.people[USER_KEY]?.name}`}
            </span>
          </div>
          {item.messages && item.messages.length !== 0 && (
            <div className={styles.lastMsg}>
              <div className={styles.content}>
                {item.type === PUBLIC_GROUP_CHAT_TYPE ? item.messages[0]?.name + ' : ' : ''}
                {item.messages[0]?.deletedAt ? t('userChatManagement.deletedMsg') : item.messages[0]?.content}
              </div>
              <div className={styles.time}>
                {showTimeChatMessenger(t('userChatManagement.yesterday'), item.messages[0]?.createdAt, false)}
              </div>
            </div>
          )}
        </div>
      </Col>
    ));
    // eslint-disable-next-line
  }, [listGroup, activeGroup]);

  useEffect(() => {
    if (listGroupChat.length) {
      setListGroup(
        listGroupChat.filter((item: IGroupChatDetail) =>
          item.people[STORE_KEY]?.name?.toLowerCase().includes(nameSearch.trim().toLowerCase())
        )
      );
    }
  }, [listGroupChat, nameSearch]);

  return (
    <div className={styles.listGroupChat}>
      <Row className={styles.rowListChatStore}>
        <Col span={24} className={styles.title}>
          <img src={backLeft} alt="backLeft" width={38} height={24} onClick={() => navigate('/user-management')} />
          <strong>{userProfile.surname + userProfile.name}</strong>
        </Col>
        <Col span={24} className={styles.searchStore}>
          <Input
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className={styles.inputFindStore}
            prefix={<SearchIcon />}
            placeholder={t('userChatManagement.placeholderFindStore')}
            onBlur={(e) => handleTrimSpaceInput(e)}
          />
        </Col>
        <Col span={24} className={styles.boxListStore}>
          {listGroup.length > 0 && boxGroupChat}
          {listGroup.length === 0 && !nameSearch && (
            <div className={styles.listChatStoreEmpty}>
              <img height={150} width={150} src={listGroupChatEmpty} alt="List Store Empty" />
              <strong>{t('userChatManagement.listChatEmpty1')}</strong>
              <strong>{t('userChatManagement.listChatEmpty2')}</strong>
            </div>
          )}
          {listGroup.length === 0 && nameSearch && (
            <div className={styles.listChatStoreEmpty}>
              <img height={150} width={150} src={notHaveStore} alt="Not Have Store" />
              <strong>{t('userChatManagement.notHaveStore1')}</strong>
              <strong>{t('userChatManagement.notHaveStore2')}</strong>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default MessengerListGroupChat;
