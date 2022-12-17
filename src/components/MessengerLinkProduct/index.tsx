import React from 'react';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';

import styles from './styles.module.scss';
import { useDetailProduct } from 'hooks/useUserChatManagement';
import { checkPriceDiscount } from 'helper/index';
import SpinLoading from 'components/SpinLoading';
import CommonURLImage from 'components/CommonURLImage';

const MessengerLinkProduct = (props: IMessengerLinkProductProps) => {
  const { productId, className } = props;

  const { data: productDetail, isLoading: isLoadingDetailProduct }: IProductDetailResponse =
    useDetailProduct(productId);

  return (
    <a className={styles.linkProduct} href={'/products/' + productId} target="_blank" rel="noopener noreferrer">
      {isLoadingDetailProduct && <SpinLoading />}
      {!isLoadingDetailProduct && (
        <div
          className={classNames({
            [styles.msgLink]: true,
            [className || '']: true,
          })}
        >
          <CommonURLImage src={productDetail?.product_medias[0]?.media_path} alt="Product" className={styles.img} />
          <div className={styles.infoProduct}>
            <span className={styles.category}>{productDetail?.brand.name}</span>
            <span className={styles.name}>{productDetail?.name}</span>
            <div className={styles.price}>
              <NumberFormat
                value={checkPriceDiscount(Number(productDetail?.max_price), Number(productDetail?.max_discount))}
                displayType={'text'}
                thousandSeparator={true}
                prefix="VNĐ"
                className={classNames({
                  [styles.crossPrice]: true,
                  [styles.paddingRight5px]:
                    checkPriceDiscount(Number(productDetail?.max_price), Number(productDetail?.max_discount)) !==
                    Number(productDetail?.max_discount),
                })}
              />
              <NumberFormat
                value={Number(productDetail?.max_discount)}
                displayType={'text'}
                thousandSeparator={true}
                prefix="VNĐ"
                className={styles.paymentPrice}
              />
            </div>
          </div>
        </div>
      )}
    </a>
  );
};

export default MessengerLinkProduct;
