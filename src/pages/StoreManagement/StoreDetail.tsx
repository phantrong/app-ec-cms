import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Col, Row, Skeleton, Form, FormInstance, Input, Button, message } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';
import { useMutation, useQueryClient } from 'react-query';
import { Helmet } from 'react-helmet-async';

import { useStoreDetail } from 'hooks/useListStores';
import CommonURLImage from 'components/CommonURLImage';
import { formatCurrencyNumber, getDayWeek, handlePreventInvalidInputNumber } from 'helper';
import { IS_MOBILE_1024, NORMAL_VALIDATE } from 'constants/constants';
import { apiSettingFeeStore } from 'api/storeManagement';
import { GET_STORE_DETAIL } from 'constants/keyQuery';
import useViewport from 'hooks/useViewPort';

import styles from './styles.module.scss';
import iconBack from 'assets/images/icons/icon-back-left.svg';
import iconCall from 'assets/images/icons/icon-call.svg';
import iconSms from 'assets/images/icons/icon-sms.svg';
import iconMsgBrown from 'assets/images/icons/icon-msg-brown.svg';
import iconLocation from 'assets/images/icons/icon-location-store.svg';
import iconCalendarAdd from 'assets/images/icons/icon-calendar-add.svg';
import iconCalendar2 from 'assets/images/icons/icon-calendar-2.svg';
import iconHour from 'assets/images/icons/icon-hour-input.svg';
import iconTotalIncome from 'assets/images/money-blue.svg';
import iconCommission from 'assets/images/money-up-arrow-red.svg';
import iconRealityIncome from 'assets/images/money-green.svg';
import iconTotalProducts from 'assets/images/total-products.svg';
import iconTotalOrders from 'assets/images/total-orders.svg';
import iconTotalLiveStreams from 'assets/images/total-live-streams.svg';

const StoreDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [form]: FormInstance<any>[] = Form.useForm();
  const query = useQueryClient();
  const { width }: { width: number } = useViewport();
  const isMobile: boolean = width <= IS_MOBILE_1024;

  // List live stream
  const { data: userDetail, isLoading: isLoadingUserDetail }: IStoreDetailResponse = useStoreDetail(Number(id));

  const { mutate: editFee, isLoading: isLoadingEditFee } = useMutation(
    (dataSend: ISettingFeeStore) => apiSettingFeeStore(dataSend),
    {
      onSuccess: () => {
        message.success(t('C3005StoreDetail.editAccSuccess'));
        query.refetchQueries(GET_STORE_DETAIL);
      },
    }
  );

  const handleFinishFee = useCallback(
    (values: { commission: string }) => {
      editFee({
        id: Number(id),
        commission: Number(values.commission),
      });
    },
    [editFee, id]
  );

  return (
    <div className={styles.containerDetail}>
      <Helmet>
        <title>{t('tabTitle.storeDetail')}</title>
      </Helmet>
      {/* Top */}
      <div
        className={styles.detailTitle}
        onClick={() =>
          navigate('/store-management', {
            state: location?.state,
          })
        }
      >
        <img src={iconBack} alt="back" />
        <div className={styles.title}>{t('C3005StoreDetail.title')}</div>
      </div>

      {/* Content */}
      {isLoadingUserDetail ? (
        <Skeleton.Button active className={styles.skeletonDetail} />
      ) : (
        <div className={styles.info}>
          <div className={styles.title}>{t('C3005StoreDetail.personalInfo')}</div>
          <Row className={styles.infoDetail} gutter={30}>
            <Col span={isMobile ? 6 : 3} className={styles.left}>
              <div>
                <CommonURLImage className={styles.avatar} src={userDetail?.avatar} alt="Avatar" />
              </div>
            </Col>
            <Col span={17}>
              <div className={styles.left}>
                <div className={styles.basicInfo}>
                  <div className={styles.name}>{userDetail?.name}</div>

                  <div className={styles.phone}>
                    <img src={iconCall} alt="call" />
                    <div className={styles.longContent}>{userDetail?.phone}</div>
                  </div>

                  <div className={styles.email}>
                    <img src={iconSms} alt="email" />
                    <div className={styles.longContent}>{userDetail?.customer?.mail}</div>
                  </div>

                  <div className={styles.email}>
                    <img src={iconCalendar2} alt="work day" />
                    <div className={styles.longContent}>{getDayWeek(userDetail?.work_day)}</div>
                  </div>
                </div>
                <div className={styles.basicInfo}>
                  <div className={styles.visibleName}>{userDetail?.name}</div>

                  <div className={styles.phone}>
                    <img src={iconLocation} alt="address" />
                    <div className={styles.longContent}>{userDetail?.address_detail}</div>
                  </div>

                  <div className={styles.email}>
                    <img src={iconCalendarAdd} alt="created" />
                    <div className={styles.longContent}>
                      {userDetail?.date_approved ? moment(userDetail.date_approved).format('YYYY/MM/DD') : ''}
                    </div>
                  </div>

                  <div className={styles.email}>
                    <img src={iconHour} alt="hour" />
                    <div className={styles.longContent}>
                      {userDetail?.time_start} - {userDetail?.time_end}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.des}>{userDetail?.description}</div>
            </Col>
            <Col span={isMobile ? 1 : 4}>
              <img
                src={iconMsgBrown}
                alt="msg"
                className={styles.iconMsg}
                onClick={() => navigate(`/store-management/chat-messenger/${userDetail?.id}`)}
              />
            </Col>
          </Row>

          <div className={styles.statistical}>
            {/* Revenue */}
            <div className={styles.block}>
              <div className={styles.titleStatistical}>
                <div className={styles.titleFirst}>{t('C3005StoreDetail.income')}</div>
                <div className={styles.link} onClick={() => navigate(`/payment?store_name=${userDetail?.name}`)}>
                  {t('C3005StoreDetail.toWithDraw')}
                </div>
              </div>
              <Row gutter={20}>
                <Col span={8}>
                  <div className={styles.stripePart}>
                    <div className={styles.topStripe}>
                      <div className={styles.name}>{t('C3005StoreDetail.totalIncome')}</div>
                      <img src={iconTotalIncome} alt="total income" />
                    </div>
                    <div className={classNames(styles.currency, styles.currencyStore)}>
                      {formatCurrencyNumber(userDetail?.revenue_total)} VNĐ
                    </div>
                  </div>
                </Col>

                <Col span={8}>
                  <div className={styles.stripePart}>
                    <div className={styles.topStripe}>
                      <div className={styles.name}>{t('C3005StoreDetail.commission')}</div>
                      <img src={iconCommission} alt="commission" />
                    </div>
                    <div className={classNames(styles.currency, styles.currencyCommission)}>
                      {formatCurrencyNumber(Number(userDetail?.revenue_total) - Number(userDetail?.revenue_store))} VNĐ
                    </div>
                  </div>
                </Col>

                <Col span={8}>
                  <div className={styles.stripePart}>
                    <div className={styles.topStripe}>
                      <div className={styles.name}>{t('C3005StoreDetail.realityInCome')}</div>
                      <img src={iconRealityIncome} alt="reality income" />
                    </div>
                    <div className={classNames(styles.currency, styles.currencyReality)}>
                      {formatCurrencyNumber(userDetail?.revenue_store)} VNĐ
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Orders and products */}
            <div className={styles.block}>
              <div className={styles.titleStatistical}>
                <div className={styles.titleFirst}>{t('C3005StoreDetail.orderSummary')}</div>
                <div className={styles.link} onClick={() => navigate(`/list-orders?key_word=${userDetail?.name}`)}>
                  {t('C3005StoreDetail.seeMore')}
                </div>
              </div>
              <Row gutter={20}>
                <Col span={12}>
                  <div className={styles.stripePart}>
                    <div className={styles.topStripe}>
                      <div className={styles.name}>{t('C3005StoreDetail.numberOfItems')}</div>
                      <img src={iconTotalProducts} alt="total products" />
                    </div>
                    <div className={classNames(styles.currency, styles.totalProducts)}>{userDetail?.total_product}</div>
                  </div>
                </Col>

                <Col span={12}>
                  <div className={styles.stripePart}>
                    <div className={styles.topStripe}>
                      <div className={styles.name}>{t('C3005StoreDetail.totalOrdersQuantity')}</div>
                      <img src={iconTotalOrders} alt="total orders" />
                    </div>
                    <div className={classNames(styles.currency, styles.currencyStore)}>
                      {userDetail?.total_order || 0}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Live */}
            <div className={styles.block}>
              <div className={styles.titleStatistical}>
                <div className={styles.titleFirst}>{t('C3005StoreDetail.live')}</div>
                <div className={styles.link} onClick={() => navigate(`/live-streams?key_word=${userDetail?.name}`)}>
                  {t('C3005StoreDetail.seeMore')}
                </div>
              </div>
              <Row>
                <Col span={24}>
                  <div className={styles.stripePart}>
                    <div className={styles.topStripe}>
                      <div className={styles.name}>{t('C3005StoreDetail.liveCount')}</div>
                      <img src={iconTotalLiveStreams} alt="total live" />
                    </div>
                    <div className={classNames(styles.currency, styles.totalLive)}>{userDetail?.total_livestream}</div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Fee commission */}
            <div className={styles.block}>
              <div className={styles.titleStatistical}>
                <div className={styles.titleFirst}>{t('C3005StoreDetail.feeSetting')}</div>
              </div>

              <Form form={form} name="statistical" onFinish={handleFinishFee} className={styles.form}>
                <Form.Item
                  className={styles.feeInput}
                  colon={false}
                  name="commission"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || (value >= NORMAL_VALIDATE.MIN_0 && value <= NORMAL_VALIDATE.MAX_100)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error(t('validate.enterValueFrom0To100')));
                      },
                    }),
                    {
                      required: true,
                      message: t('validate.plsSetAFee'),
                    },
                  ]}
                  initialValue={userDetail?.commission}
                >
                  <NumberFormat
                    className="normal-input-antd-form"
                    customInput={Input}
                    placeholder={t('C3005StoreDetail.setFee')}
                    onKeyDown={(e: React.KeyboardEvent) => handlePreventInvalidInputNumber(e)}
                  />
                </Form.Item>

                <Form.Item className={styles.btnSubmit}>
                  <Button type="primary" htmlType="submit" loading={isLoadingEditFee}>
                    {t('C3005StoreDetail.keep')}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDetail;
