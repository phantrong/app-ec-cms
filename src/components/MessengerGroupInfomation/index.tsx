import { Button, Col, Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';
import CommonURLImage from 'components/CommonURLImage';
import { STATUS_PAGE_MESSENGER } from 'constants/constants';

import IconArrowLeft from '../../assets/images/icons/icon-arrow-left.svg';
import IconLocation from '../../assets/images/icons/icon-location-store.svg';
import IconClock from '../../assets/images/icons/icon-clock-store.svg';
import IconProduct from '../../assets/images/icons/total-product.svg';
import IconCalling from '../../assets/images/icons/icon-calling.svg';
import BackLeft from '../../assets/images/icons/icon-back-left.svg';
import defaultAvatar from 'assets/images/avatar.svg';

const MessengerGroupInfomation = (props: IMessengerGroupInfomationProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { store, pageStatus, setPageStatus } = props;

  const handleBackBoxChat = () => setPageStatus(STATUS_PAGE_MESSENGER.IN_BOX_CHAT);

  return (
    <div className={styles.groupInfomation}>
      {pageStatus === STATUS_PAGE_MESSENGER.IN_GROUP_INFORMATION && (
        <div className={styles.backBoxChat}>
          <img
            height={38}
            width={24}
            src={BackLeft}
            alt="BackLeft"
            className={styles.backLeft}
            onClick={handleBackBoxChat}
          />
          <span onClick={handleBackBoxChat} className={styles.textBackLeft}>
            {t('userChatManagement.backBoxChat')}
          </span>
        </div>
      )}
      {store && (
        <Row className={styles.rowInfomation}>
          <Col span={24} className={styles.avt}>
            <CommonURLImage src={store?.avatar || defaultAvatar} alt="Store" />
            <strong>{store?.name}</strong>
          </Col>
          <Col span={24} className={styles.info}>
            <div className={styles.text}>
              <img height={21} width={20} src={IconLocation} alt="Location" />
              <strong>{store?.address}</strong>
            </div>
            <div className={styles.text}>
              <img height={20} width={20} src={IconCalling} alt="Calling" />
              <strong>{store?.phone}</strong>
            </div>
            <div className={styles.text}>
              <img height={21} width={20} src={IconClock} alt="Clock" />
              <strong>{store?.time_start + ' - ' + store?.time_end}</strong>
            </div>
            <div className={styles.text}>
              <img height={24} width={24} src={IconProduct} alt="Product" />
              <strong>{store?.total_product}</strong>
            </div>
          </Col>
          <Col span={24} className={styles.viewStore}>
            <Button className={styles.btnView} onClick={() => navigate(`/store-management/${store?.id}`)}>
              {t('userChatManagement.btnViewStore')}
              <img height={24} width={39} src={IconArrowLeft} alt="ArrowLeft" />
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default MessengerGroupInfomation;
