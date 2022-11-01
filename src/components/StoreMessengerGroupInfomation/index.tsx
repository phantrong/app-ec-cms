import React from 'react';
import { Button, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';
import { ARRAY_GENDER_TEXT, STATUS_PAGE_MESSENGER } from 'constants/constants';
import CommonURLImage from 'components/CommonURLImage';

import ageIcon from '../../assets/images/icons/age.svg';
import genderIcon from '../../assets/images/icons/gender.svg';
import backLeft from '../../assets/images/icons/icon-arrow-left-back.svg';
import arrowLeftIcon from '../../assets/images/icons/icon-arrow-left.svg';

const StoreMessengerGroupInfomation = (props: IStoreMessengerGroupInfomationProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, pageStatus, setPageStatus } = props;

  const handleBackBoxChat = () => setPageStatus(STATUS_PAGE_MESSENGER.IN_BOX_CHAT);

  return (
    <div className={styles.groupInfomation}>
      {pageStatus === STATUS_PAGE_MESSENGER.IN_GROUP_INFORMATION && (
        <div className={styles.backBoxChat}>
          <img src={backLeft} alt="BackLeft" className={styles.backLeft} onClick={handleBackBoxChat} />
          <span onClick={handleBackBoxChat} className={styles.textBackLeft}>
            {t('userChatManagement.backBoxChat')}
          </span>
        </div>
      )}
      {user && (
        <Row className={styles.rowInfomation}>
          <Col span={24} className={styles.avt}>
            <CommonURLImage src={user.avatar} alt="User" />
            <strong>{user.surname + user.name}</strong>
          </Col>
          <Col span={24} className={styles.info}>
            <div className={styles.text}>
              <img src={ageIcon} alt="age" />
              <strong>{user.birthday}</strong>
            </div>
            <div className={styles.text}>
              <img src={genderIcon} alt="gender" />
              <strong>{ARRAY_GENDER_TEXT[user.gender - 1]}</strong>
            </div>
          </Col>
          <Col span={24} className={styles.viewStore}>
            <Button className={styles.btnView} onClick={() => navigate(`/user-management/${user.id}`)}>
              {t('userChatManagement.btnViewUser')}
              <img height={24} width={39} src={arrowLeftIcon} alt="ArrowLeft" />
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default StoreMessengerGroupInfomation;
