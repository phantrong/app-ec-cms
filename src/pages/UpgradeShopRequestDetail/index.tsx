import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Button, Modal, message } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';

import styles from './style.module.scss';
import { STATUS_CODE, TOKEN_CMS, UPGRADE_SHOP_REQUEST_STATUS_VALUE } from 'constants/constants';
import { useGetUpgradeShopRequestDetail } from 'hooks/useListUpgradeShopRequest';
import SpinLoading from 'components/SpinLoading';
import { GetUpgradeShopRequestStatusText, handleErrorMessage } from 'helper';
import { apiPostUpgradeShopApproveRequest, apiPostUpgradeShopDenyRequest } from 'api/listUpgradeShopRequest';

import backLeftIcon from '../../assets/images/icons/icon-back-left.svg';

const { confirm } = Modal;

export default function UpgradeShopRequestDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const isAuthenticated: boolean = !!Cookies.get(TOKEN_CMS);
  const { requestId } = useParams();
  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(false);
  const [isLoadingDeny, setIsLoadingDeny] = useState<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<number>(UPGRADE_SHOP_REQUEST_STATUS_VALUE.ALL);
  const {
    data: upgradeShopRequestDetail,
    isLoading: isLoadingUpgradeShopRequestDetail,
  }: IUpgradeShopRequestDetailResponseData = useGetUpgradeShopRequestDetail(isAuthenticated, Number(requestId));

  const { mutate: approveRequest } = useMutation(
    (params: IApproveUpgradeShopRequestParams) => apiPostUpgradeShopApproveRequest(params),
    {
      onSuccess: (response: IBasicSucessResponse) => {
        if (response.success) {
          message.success(t('upgradeShopRequestDetail.successApproveMessage'));
          setRequestStatus(UPGRADE_SHOP_REQUEST_STATUS_VALUE.APPROVED);
        }
        setIsLoadingApprove(false);
      },
      onError: (error) => {
        const errorMessage = error as AxiosError;
        if (errorMessage.response?.status === STATUS_CODE.HTTP_NOT_ACCEPTABLE) {
          message.error(t('upgradeShopRequestDetail.stripeErrorApproveMessage'));
        } else {
          handleErrorMessage(error);
        }
        setIsLoadingApprove(false);
      },
    }
  );

  const { mutate: denyRequest } = useMutation(
    (params: IApproveUpgradeShopRequestParams) => apiPostUpgradeShopDenyRequest(params),
    {
      onSuccess: (response: IBasicSucessResponse) => {
        if (response.success) {
          message.success(t('upgradeShopRequestDetail.successDenyMessage'));
          setRequestStatus(UPGRADE_SHOP_REQUEST_STATUS_VALUE.DENIED);
        }
        setIsLoadingDeny(false);
      },
      onError: (error) => {
        handleErrorMessage(error);
        setIsLoadingDeny(false);
      },
    }
  );

  useEffect(() => {
    if (isNaN(Number(requestId)) || !requestId) {
      navigate('/upgrade-shop-requests');
    }
  }, [requestId, navigate]);

  useEffect(() => {
    if (upgradeShopRequestDetail) {
      setRequestStatus(upgradeShopRequestDetail.status);
    }
  }, [upgradeShopRequestDetail]);

  const handleApproveRequest = useCallback(() => {
    setIsLoadingApprove(true);
    confirm({
      title: <div>{t('upgradeShopRequestDetail.confirmApprove')}</div>,
      okText: t('upgradeShopRequestDetail.approveBtn'),
      cancelText: t('common.cancel'),
      icon: <></>,
      className: 'modal-confirm-normal',
      centered: true,
      onOk() {
        if (upgradeShopRequestDetail) {
          approveRequest({
            store_id: upgradeShopRequestDetail.store_id,
          });
        }
      },
      onCancel() {
        setIsLoadingApprove(false);
      },
    });
  }, [approveRequest, t, upgradeShopRequestDetail]);

  const handleDenyRequest = useCallback(() => {
    setIsLoadingDeny(true);
    confirm({
      title: <div>{t('upgradeShopRequestDetail.confirmDeny')}</div>,
      okText: t('upgradeShopRequestDetail.okDeny'),
      cancelText: t('common.cancel'),
      icon: <></>,
      className: 'modal-confirm-normal',
      centered: true,
      onOk() {
        if (upgradeShopRequestDetail) {
          denyRequest({
            store_id: upgradeShopRequestDetail.store_id,
          });
        }
      },
      onCancel() {
        setIsLoadingDeny(false);
      },
    });
  }, [denyRequest, t, upgradeShopRequestDetail]);

  const handleBackListRequest = () => navigate('/upgrade-shop-requests', { state });

  return (
    <div className={styles.upgradeShopRequestDetail}>
      <Helmet>
        <title>{t('tabTitle.upgradeShopRequestDetail')}</title>
      </Helmet>
      <Row justify="space-between" align="bottom" className={styles.title}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <h2>
            <img src={backLeftIcon} alt="back" width={38} height={24} onClick={handleBackListRequest} />
            &nbsp;
            {t('upgradeShopRequestDetail.title')}
          </h2>
        </Col>
        {!isLoadingUpgradeShopRequestDetail && requestStatus === UPGRADE_SHOP_REQUEST_STATUS_VALUE.WAIT_APPROVE && (
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.btnRow}>
            <Button
              type="primary"
              className={styles.approveBtn}
              onClick={handleApproveRequest}
              loading={isLoadingApprove}
            >
              {t('upgradeShopRequestDetail.approveBtn')}
            </Button>
            <Button type="primary" className={styles.denyBtn} onClick={handleDenyRequest} loading={isLoadingDeny}>
              {t('upgradeShopRequestDetail.denyBtn')}
            </Button>
          </Col>
        )}
      </Row>
      {!isLoadingUpgradeShopRequestDetail && (
        <Row justify="space-between" align="bottom" className={styles.statusRow}>
          <Col xs={24} sm={24} md={6} lg={3} xl={3} className={styles.statusBtn}>
            <span className={styles.statusTitle}>{t('upgradeShopRequestDetail.status')}</span>
            <Button type="primary" className={`${styles.denyBtn} ${styles.showStatusBtn}`}>
              {GetUpgradeShopRequestStatusText(requestStatus)}
            </Button>
          </Col>
        </Row>
      )}
      {isLoadingUpgradeShopRequestDetail && <SpinLoading />}
      {!isLoadingUpgradeShopRequestDetail && (
        <Row className={styles.upgradeRequestForm}>
          <Col span={24} className={styles.upgradeRequestCol}>
            <Col xs={24} sm={24} md={24} lg={18} xl={18} className={styles.shopForm}>
              <div className={styles.formTitle}>{t('upgradeShopRequestDetail.shopForm.title')}</div>
              <div className={styles.formInfo}>
                <div className={styles.label}>{t('upgradeShopRequestDetail.shopForm.shopName')}</div>
                <div className={styles.content}>{upgradeShopRequestDetail?.store_name}</div>
              </div>
              <div className={styles.formInfo}>
                <div className={styles.label}>{t('upgradeShopRequestDetail.shopForm.address')}</div>
                <div className={styles.content}>{upgradeShopRequestDetail?.store_address}</div>
              </div>
              <div className={styles.formInfo}>
                <div className={styles.label}>{t('upgradeShopRequestDetail.shopForm.description')}</div>
                <div className={styles.content}>{upgradeShopRequestDetail?.description}</div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={18} xl={18} className={styles.stripeForm}>
              <div className={styles.formTitle}>{t('upgradeShopRequestDetail.stripeForm.title')}</div>
              <div className={styles.formInfo}>
                <div className={styles.label}>{t('upgradeShopRequestDetail.stripeForm.email')}</div>
                <div className={styles.content}>{upgradeShopRequestDetail?.customer_email}</div>
              </div>
              <div className={styles.formInfo}>
                <div className={styles.label}>{t('upgradeShopRequestDetail.stripeForm.name')}</div>
                <div className={styles.content}>{upgradeShopRequestDetail?.customer_name}</div>
              </div>
              <div className={styles.formInfo}>
                <div className={styles.label}>{t('upgradeShopRequestDetail.stripeForm.phone')}</div>
                <div className={styles.content}>{upgradeShopRequestDetail?.customer_phone}</div>
              </div>
            </Col>
          </Col>
        </Row>
      )}
    </div>
  );
}
