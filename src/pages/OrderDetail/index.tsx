import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Row, Col, Skeleton } from 'antd';
import { Link, useLocation, useParams } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { Helmet } from 'react-helmet-async';
import dayjs from 'dayjs';
import classNames from 'classnames';

import { IS_MOBILE_1024, STATUS_ORDERS } from '../../constants/constants';
import { useOrderDetail } from 'hooks/useOrderDetail';
import { handleErrorMessage, handleExportExcel } from 'helper';
import { EXPORT_ORDER_DETAIL_API } from 'api/orderDetail';
import useViewport from 'hooks/useViewPort';
import CommonURLImage from 'components/CommonURLImage';

import styles from './style.module.scss';
import IconBack from 'assets/images/icons/icon-back-left.svg';
import IconCSV from 'assets/images/icon-csv.svg';

// import IconCoupon from 'assets/images/icons/icon-coupon.svg';

const BackIcon = () => <img src={IconBack} alt="Back Icon" />;
// const CouponIcon = () => <img src={IconCoupon} alt="Coupon Icon" />;

interface ITitleModalStatus {
  title: string;
}

export default function ListOrder() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { state } = useLocation();
  const { data: orderDetail, isLoading: isLoadingOrderDetail }: IDataOrderDetail = useOrderDetail(Number(id));
  const { width }: { width: number } = useViewport();
  const isMobile: boolean = width <= IS_MOBILE_1024;

  const [statusNowSubOrder, setStatusNowSubOrder] = useState<number>(STATUS_ORDERS.DEFAULT);
  const [textStatus, setTextStatus] = useState<string>('');
  const [isLoadingBtnExport, setIsLoadingBtnExport] = useState<boolean>(false);

  const quantityProducts: number | undefined = orderDetail?.order_items?.reduce(
    (total: number, item: IDataProductDetail) => total + item.quantity,
    0
  );

  useEffect(() => {
    setStatusNowSubOrder(orderDetail?.status || STATUS_ORDERS.DEFAULT);
  }, [orderDetail]);

  useEffect(() => {
    switch (statusNowSubOrder) {
      case STATUS_ORDERS.WAIT_FOR_GOOD:
        setTextStatus(t('C2005ListOrders.status.waitForGood'));
        break;
      case STATUS_ORDERS.SHIPPING:
        setTextStatus(t('C2005ListOrders.status.shipping'));
        break;
      case STATUS_ORDERS.SHIPPED:
        setTextStatus(t('C2005ListOrders.status.shipped'));
        break;
      case STATUS_ORDERS.CANCEL:
        setTextStatus(t('C2005ListOrders.status.cancel'));
        break;
      default:
        return setTextStatus(t('C2005ListOrders.status.waitConfirm'));
    }
  }, [statusNowSubOrder, t]);

  // Action
  const getClassesProductText = (params?: IProductTypeConfig[]) =>
    params
      ?.map((item: IProductTypeConfig) => {
        return item?.type_name + ' - ' + item?.name;
      })
      .join(', ') || '';

  const getAddressText = (shipping?: IOrderDetail) =>
    `${shipping?.address_01 || ''} ${shipping?.address_02 || ''} ${shipping?.address_03 || ''} ${
      shipping?.address_04 || ''
    }`;

  const handleExportOrderDetail = useCallback(async () => {
    setIsLoadingBtnExport(true);
    try {
      handleExportExcel(
        EXPORT_ORDER_DETAIL_API + orderDetail?.id,
        null,
        t('C2006OrderDetail.fileExportName', {
          name: orderDetail?.receiver_name,
          year: dayjs(orderDetail?.created_at).format('YYYY'),
          month: dayjs(orderDetail?.created_at).format('MM'),
          day: dayjs(orderDetail?.created_at).format('DD'),
        }) + '.pdf',
        () => setIsLoadingBtnExport(false)
      );
    } catch (error) {
      handleErrorMessage(error);
      setIsLoadingBtnExport(false);
    }
  }, [orderDetail, t]);

  // List items products
  const listItemProducts = useMemo(() => {
    return orderDetail?.order_items?.map((item: IDataProductDetail, index: number) => (
      <Row className={styles.productOrder} align="middle" key={index}>
        <Col span={isMobile ? 4 : 3}>
          <CommonURLImage
            src={item.product_class.product.product_medias_image.media_path}
            alt="Product"
            className={styles.avtProduct}
          />
        </Col>
        <Col span={isMobile ? 9 : 12}>
          <Row>
            <Col span={23}>
              <Link to="/products">
                <strong className={styles.nameProduct}>{item.product_class.product.name}</strong>
              </Link>
            </Col>
          </Row>
          <Row>
            <Col span={23} className={styles.colorGray}>
              {getClassesProductText(item.product_class.product_type_configs)}
            </Col>
          </Row>
        </Col>
        <Col span={3}>
          <NumberFormat value={Number(item.price)} displayType="text" thousandSeparator={true} prefix="¥" />
        </Col>
        <Col
          span={3}
          className={classNames({
            [styles.textCenter]: isMobile,
          })}
        >
          {item.quantity}
        </Col>
        <Col span={isMobile ? 5 : 3} className={styles.textRight}>
          <strong className={styles.textPrice}>
            <NumberFormat
              value={Number(item.price) * item.quantity}
              displayType="text"
              thousandSeparator={true}
              prefix="¥"
            />
          </strong>
        </Col>
      </Row>
    ));
  }, [isMobile, orderDetail]);

  return (
    <div className={styles.orderDetail}>
      <Helmet>
        <title>{t('tabTitle.orderDetail')}</title>
      </Helmet>

      {isLoadingOrderDetail ? (
        <Skeleton.Button active className={styles.skeleton} />
      ) : (
        <>
          <Row justify="space-between" align="bottom" className={styles.title}>
            <Link to={'/list-orders'} state={state} className={styles.textTitle}>
              <BackIcon /> {t('C2006OrderDetail.title')}
            </Link>
            <Row className={styles.btnStatus}>
              {/* Export PDF */}
              <Button
                type="primary"
                className={styles.btnExport}
                loading={isLoadingBtnExport}
                onClick={handleExportOrderDetail}
              >
                <img src={IconCSV} alt="pdf" />
                &nbsp;
                {t('C2006OrderDetail.btnExport')}
              </Button>
            </Row>
          </Row>
          <Row justify="space-between" align="bottom" className={styles.rowInformation}>
            <span className={styles.informationOrder}>
              {`${t('C2006OrderDetail.orderId')}: ` +
                orderDetail?.code +
                ` | ${t('C2006OrderDetail.customerName')}: ` +
                orderDetail?.receiver_name}
            </span>
            <div className={styles.showStatus}>
              <label>{t('C2006OrderDetail.showStatus')}</label>
              <span className={styles.statusOrder}>{textStatus}</span>
            </div>
          </Row>
          <Row className={styles.rowProductDetail} gutter={30}>
            <Col span={18}>
              <Row className={styles.colOrderDetail}>
                <Col span={isMobile ? 4 : 3}>{t('C2006OrderDetail.rowProductDetail.colImage')}</Col>
                <Col span={isMobile ? 9 : 12}>{t('C2006OrderDetail.rowProductDetail.colNameProduct')}</Col>
                <Col span={3}>{t('C2006OrderDetail.rowProductDetail.colUnitPrice')}</Col>
                <Col
                  span={3}
                  className={classNames({
                    [styles.textCenter]: isMobile,
                  })}
                >
                  {t('C2006OrderDetail.rowProductDetail.colQuantity')}
                </Col>
                <Col span={isMobile ? 5 : 3} className={styles.textRight}>
                  {t('C2006OrderDetail.rowProductDetail.colPriceProduct')}
                </Col>
              </Row>
              <Row className={styles.productDetail}>
                <Row className={styles.nameStore}>
                  <Col span={24} className={styles.storeInfo}>
                    <div className={styles.avtWrapper}>
                      <CommonURLImage src={orderDetail?.avatar} alt="Avatar Store" className={styles.avtStore} />
                    </div>
                    {orderDetail?.store_name}
                  </Col>
                </Row>

                <Row className={styles.listProduct}>{listItemProducts}</Row>
                {/* <Row className={styles.couponOrder}>
          <Col span={24} className={styles.nameCoupon}>
            <CouponIcon />
            &ensp; {t('C2006OrderDetail.rowProductDetail.coupon')} &emsp;
            <strong className={styles.textNotCoupon}>{t('C2006OrderDetail.rowProductDetail.notCoupon')}</strong>
          </Col>
        </Row> */}
              </Row>
            </Col>
            <Col span={6}>
              <Row className={styles.rowInfoOrder}>
                <Row className={styles.shippingOrder}>
                  <strong className={styles.titleShipping}>
                    {t('C2006OrderDetail.rowProductDetail.shipping.title')}
                  </strong>
                  <div className={styles.colShipping}>
                    <span>{t('C2006OrderDetail.rowProductDetail.shipping.name')}</span>
                    <strong>{orderDetail?.receiver_name}</strong>
                  </div>
                  <div className={styles.colShipping}>
                    <span>{t('C2006OrderDetail.rowProductDetail.shipping.nameFurigana')}</span>
                    <strong>{orderDetail?.receiver_name_furigana}</strong>
                  </div>
                  <div className={styles.colShipping}>
                    <span>{t('C2006OrderDetail.rowProductDetail.shipping.phone')}</span>
                    <strong>{orderDetail?.phone_number}</strong>
                  </div>
                  <div className={styles.colShipping}>
                    <span>{t('C2006OrderDetail.rowProductDetail.shipping.address')}</span>
                    <strong>{getAddressText(orderDetail)}</strong>
                  </div>
                </Row>
                <Row className={styles.priceOrder}>
                  <strong className={styles.titlePriceOrder}>
                    {t('C2006OrderDetail.rowProductDetail.priceOrder.title')}
                  </strong>
                  <div className={styles.colTotalPrice}>
                    <span>
                      {t('C2006OrderDetail.rowProductDetail.priceOrder.totalPrice') +
                        '（' +
                        quantityProducts +
                        'つ商品）'}
                    </span>
                    <strong>
                      <NumberFormat
                        value={Number(orderDetail?.total_payment)}
                        displayType="text"
                        thousandSeparator={true}
                        prefix="¥"
                      />
                    </strong>
                  </div>
                  {/* <div className={styles.colDiscountPrice}>
            <span>{t('C2006OrderDetail.rowProductDetail.priceOrder.discountPrice')}</span>
            <strong>0</strong>
          </div> */}
                  <div className={styles.colPaymentPrice}>
                    <span>{t('C2006OrderDetail.rowProductDetail.priceOrder.paymentPrice')}</span>
                    <strong className={styles.textPrice}>
                      <NumberFormat
                        value={Number(orderDetail?.total_payment)}
                        displayType="text"
                        thousandSeparator={true}
                        prefix="¥"
                      />
                    </strong>
                  </div>
                </Row>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
