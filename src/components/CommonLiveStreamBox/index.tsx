import React, { useCallback } from 'react';
import { Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import CommonURLImage from 'components/CommonURLImage';
import { LIVE_NOW_STATUS, PREPARING_LIVE_STATUS, STREAMED_STATUS } from 'constants/constants';
import { compareDurationInSameDay } from 'helper';
import configs from 'config';

import styles from './styles.module.scss';
import iconDownload from 'assets/images/icons/icon-download.svg';
import violationLive from 'assets/images/violation-live.svg';

const CommonLiveStreamBox = (props: { item: IListLive }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { item } = props;

  const handleRedirectLive = useCallback(
    (item: IListLive) => {
      if (item.status === LIVE_NOW_STATUS) return window.open(`/live-streams/${item.id}`, '_blank');
      if (item.status === STREAMED_STATUS) return window.open(`/view-live/${item.id}`, '_blank');
      return navigate(`/stores/${item.store_id}`);
    },
    [navigate]
  );

  return (
    <div className={styles.boxLive}>
      <div className={styles.imgLive}>
        {item.violation ? (
          <div className={styles.violation} onClick={() => handleRedirectLive(item)}>
            <img src={violationLive} alt="violation" />
          </div>
        ) : (
          <div className={styles.rectangleImg}>
            <CommonURLImage src={item.image} alt="live stream" handleOnClick={() => handleRedirectLive(item)} />
          </div>
        )}
        {item.status === LIVE_NOW_STATUS && <Badge className={styles.liveFlag} count={t('C2002ListLiveStream.live')} />}
      </div>

      <div className={styles.boxLiveBottom}>
        <CommonURLImage
          className={styles.avatar}
          src={item.store.avatar}
          alt="avatar store"
          handleOnClick={() => handleRedirectLive(item)}
        />

        <div className={styles.boxLiveBottomRight}>
          <div className={styles.title} onClick={() => handleRedirectLive(item)}>
            {item.title}
          </div>

          <div>
            <div className={styles.nameTime} onClick={() => handleRedirectLive(item)}>
              {item.store.name}
            </div>

            <div className={styles.nameTime}>
              {item.status === PREPARING_LIVE_STATUS && <>{moment(item.start_time).format('YYYY/MM/DD HH:mm')}</>}

              {item.status === LIVE_NOW_STATUS && (
                <>
                  {item?.view?.toLocaleString().replace(/,/g, '.')} {t('C2002ListLiveStream.audience')}
                </>
              )}
              {item.status === STREAMED_STATUS && (
                <div className={styles.streamedDownload}>
                  <div>
                    {t('live.startTime')} <span>{compareDurationInSameDay(item?.time_passed)}</span>
                  </div>
                  {item.has_link === 1 && (
                    <img
                      src={iconDownload}
                      alt="download"
                      onClick={() => window.open(`${configs.API_DOMAIN}/download/livestream/${item.id}`, '_blank')}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonLiveStreamBox;
