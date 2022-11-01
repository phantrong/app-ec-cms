import React, { useEffect, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';

interface TimeProps {
  startTime: number;
}

const LiveDowntime = (props: TimeProps) => {
  const { t } = useTranslation();
  const [time, setTime] = useState<number>(props.startTime);
  const day = Math.floor(time / (24 * 3600));
  const hour = Math.floor((time - day * (24 * 3600)) / 3600);
  const minute = Math.floor((time - day * (24 * 3600) - hour * 3600) / 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderTime = () => {
    let time = '';
    if (day > 0) {
      return day + t('common.day') + t('common.before');
    }
    if (!minute && !hour) {
      return t('common.justNow') + t('common.before');
    }
    if (hour > 0) {
      time += hour + t('live.hour');
    }
    if (minute > 0) {
      time += minute + t('live.minute');
    }
    return time + t('common.before');
  };

  return <>{renderTime()}</>;
};

export default memo(LiveDowntime);
