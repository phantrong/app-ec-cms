import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import iconBack from 'assets/images/icons/icon-back-left.svg';

import styles from './styles.module.scss';
import { formatCurrencyNumber, formatPhone } from 'helper';
import { useBankRetrieve, usePayoutDetailStore } from 'hooks/usePayoutHistory';
import moment from 'moment';

import { BANK_TYPE_INDIVIDUAL, STATUS_WITHDRAW } from 'constants/constants';
import SpinLoading from 'components/SpinLoading';
import { useStoreDetail } from 'hooks/useListStores';

const Detail = () => {
  const { t } = useTranslation();
  const { payoutId } = useParams();

  const navigate = useNavigate();
  const [storeId, setStoreId] = useState<number | undefined>();

  const { data: payoutDetail, isLoading: isLoadingPayoutDetail }: IDataPayoutDetail = usePayoutDetailStore(
    payoutId ? Number(payoutId) : 0
  );

  const { data: bankRetrieve }: IDataBankRetrieve = useBankRetrieve(Number(storeId));
  const { data: storeDetail, isLoading: isLoadingStoreDetail }: IStoreBasicDetailResponse = useStoreDetail(
    storeId ? Number(storeId) : 0
  );

  useEffect(() => {
    if (payoutDetail) {
      setStoreId(payoutDetail.store_id);
    } else {
      setStoreId(undefined);
    }
  }, [payoutDetail]);

  const getTextStatus = (status: number) =>
    STATUS_WITHDRAW.filter((item) => item.value === status).map((item: any, index: number) => (
      <div className={styles?.[item.class]} key={index}>
        {item.label}
      </div>
    ));

  const getTypePayout = (type?: number) => {
    if (!type) return;
    if (type === BANK_TYPE_INDIVIDUAL) {
      return t('payouts.individual');
    }
    return t('payouts.company');
  };

  return (
    <div className={styles.wrapper}>
      <Row gutter={24}>
        <Col span={24}>
          <div className={styles.btnBack} onClick={() => navigate('/payment')}>
            <img src={iconBack} alt="back" />
            <span>{payoutDetail?.store_name}</span>
          </div>
        </Col>
        <Col className="gutter-row" span={16}>
          <Row gutter={16}>
            <Col className="gutter-row" span={24}>
              <div className={styles.box}>
                <Row gutter={24} className={styles.rowBox}>
                  {isLoadingPayoutDetail ? (
                    <SpinLoading size="default" />
                  ) : (
                    <>
                      <Col span={12} className={styles.title}>
                        {t('payouts.detail.titlePayout')}
                      </Col>
                      <Col span={12}></Col>
                      <Col span={12}>{t('payouts.tableHistory.quantity')}</Col>
                      <Col span={12}>¥{formatCurrencyNumber(payoutDetail?.amount)}</Col>
                      <Col span={12}>{t('payouts.tableHistory.arrivalDate')}</Col>
                      <Col span={12}>
                        {payoutDetail?.arrival_date ? moment.unix(payoutDetail.arrival_date).format('YYYY/MM/DD') : ''}
                      </Col>
                      <Col span={12}>{t('payouts.detail.status')}</Col>
                      <Col span={12}>{payoutDetail?.status ? getTextStatus(payoutDetail.status) : ''}</Col>
                    </>
                  )}
                </Row>
              </div>
            </Col>
            <Col className="gutter-row" span={24}>
              <div className={`${styles.box} ${styles.bank}`}>
                <Row gutter={24} className={styles.rowBox}>
                  {isLoadingPayoutDetail ? (
                    <SpinLoading size="default" />
                  ) : (
                    <>
                      <Col span={12} className={styles.title}>
                        {t('payouts.detail.titleBank')}
                      </Col>
                      <Col span={12}></Col>
                      <Col span={12}>{t('payouts.detail.bankName')}</Col>
                      <Col span={12}>{payoutDetail?.bank_history?.bank?.name}</Col>
                      <Col span={12}>{t('payouts.detail.bankBranchName')}</Col>
                      <Col span={12}>{payoutDetail?.bank_history?.bank_branch?.name}</Col>
                      <Col span={12}>{t('payouts.detail.accountIdentification')}</Col>
                      <Col span={12}>{getTypePayout(payoutDetail?.bank_history?.type)}</Col>
                      <Col span={12}>{t('payouts.detail.accountNumber')}</Col>
                      <Col span={12}>{payoutDetail?.bank_history?.bank_number}</Col>
                      <Col span={12}>{t('payouts.detail.accountHolder')}</Col>
                      <Col span={12}>{payoutDetail?.bank_history?.customer_name}</Col>
                    </>
                  )}
                </Row>
              </div>
            </Col>
          </Row>
        </Col>
        <Col className="gutter-row" span={8}>
          <div className={`${styles.box} ${styles.infoStore}`}>
            <Row gutter={24} className={styles.rowBox}>
              {isLoadingStoreDetail ? (
                <SpinLoading size="default" />
              ) : (
                <>
                  <Col span={24} className={styles.title}>
                    {t('payouts.detail.titleStoreInfo')}
                  </Col>
                  <Col span={24}></Col>
                  <Col span={24}>{t('C3004StoreManagement.storeName')}</Col>
                  <Col span={24}>{storeDetail?.name}</Col>
                  <Col span={24}>{t('C3004StoreManagement.phone')}</Col>
                  <Col span={24}>{storeDetail?.phone ? formatPhone(`${storeDetail.phone}`) : ''}</Col>
                  <Col span={24}>{t('upgradeShopRequestDetail.shopForm.address')}</Col>
                  <Col span={24}>{storeDetail?.address_detail}</Col>
                  <Col span={24}>{t('payouts.detail.currentBalance')}</Col>
                  <Col span={24}>¥{bankRetrieve?.total}</Col>
                </>
              )}
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Detail;
