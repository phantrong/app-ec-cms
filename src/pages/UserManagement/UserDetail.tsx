import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Col, Row, Skeleton } from 'antd';
import moment from 'moment';
import { Helmet } from 'react-helmet-async';

import { useUserDetail } from 'hooks/useListUsers';
import CommonURLImage from 'components/CommonURLImage';

import styles from './styles.module.scss';
import iconBack from 'assets/images/icons/icon-back-left.svg';
import iconCall from 'assets/images/icons/icon-call.svg';
import iconSms from 'assets/images/icons/icon-sms.svg';
import iconLocation from 'assets/images/icons/icon-location-store.svg';
import iconCalendarAdd from 'assets/images/icons/icon-calendar-add.svg';
import useViewport from 'hooks/useViewPort';
import { IS_MOBILE_1024 } from 'constants/constants';

const UserDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { width }: { width: number } = useViewport();
  const isMobile: boolean = width <= IS_MOBILE_1024;

  // List live stream
  const { data: userDetail, isLoading: isLoadingUserDetail }: IUserDetailResponse = useUserDetail(Number(id));

  return (
    <div className={styles.containerDetail}>
      <Helmet>
        <title>{t('tabTitle.userDetail')}</title>
      </Helmet>
      {/* Top */}
      <div
        className={styles.detailTitle}
        onClick={() =>
          navigate('/user-management', {
            state: location?.state,
          })
        }
      >
        <img src={iconBack} alt="back" />
        <div className={styles.title}>{t('C2011DetailUser.title')}</div>
      </div>

      {/* Content */}
      {isLoadingUserDetail ? (
        <Skeleton.Button active className={styles.skeletonDetail} />
      ) : (
        <div className={styles.info}>
          <div className={styles.title}>{t('C2011DetailUser.personalInfo')}</div>
          <div>
            <Row className={styles.infoDetail} gutter={30}>
              <Col span={isMobile ? 5 : 3}>
                <div className={styles.avatar}>
                  <CommonURLImage src={userDetail?.avatar} alt="Avatar" />
                </div>
              </Col>
              <Col span={9} className={styles.left}>
                <div className={styles.basicInfo}>
                  <div className={styles.name}>
                    {userDetail?.name} {userDetail?.surname}
                  </div>

                  <div className={styles.phone}>
                    <img src={iconCall} alt="call" />
                    {userDetail?.phone}
                  </div>

                  <div className={styles.email}>
                    <img src={iconSms} alt="email" />
                    <div className={styles.longContent}>{userDetail?.email}</div>
                  </div>
                </div>
              </Col>
              <Col span={8} className={styles.left}>
                <div className={styles.basicInfo}>
                  <div className={styles.visibleName}>{userDetail?.name}</div>

                  <div className={styles.phone}>
                    <img src={iconLocation} alt="address" />
                    {userDetail?.address}
                  </div>

                  <div className={styles.email}>
                    <img src={iconCalendarAdd} alt="created" />
                    {moment(userDetail?.created_at).format('YYYY/MM/DD')}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
