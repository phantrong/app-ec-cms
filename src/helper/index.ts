import configs from 'config';
import { FormInstance, message } from 'antd';
import i18next from 'i18next';
import dayjs from 'dayjs';
import moment from 'moment';
import { UploadChangeParam } from 'antd/lib/upload';
import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';

import {
  IDENTITY_VERIFICATION_TYPE_TEXT,
  IMAGE_CATEGORY_MAX_SIZE_MB,
  MAX_WIDTH_OR_HEIGHT_IMAGE,
  MINUTES_INTERVAL_BETWEEN_TWO_TIMES,
  TEXT_GENDER,
  UPGRADE_SHOP_REQUEST_STATUS_TEXT,
  UPGRADE_SHOP_REQUEST_STATUS_VALUE,
  VALUE_GENDER,
} from 'constants/constants';
import { sendCustom } from 'api/axios';

export const handleErrorMessage = (error: any) => {
  message.destroy();
  message.error(getErrorMessage(error));
  if (configs.APP_ENV !== 'prod') {
    // tslint:disable-next-line: no-console
    console.log(error);
  }
};

export const getErrorMessage = (error: any) => {
  return error?.response?.data?.errorMessage || 'システムエラー';
};

export const trimSpaceInput = (value: string) => value.replace(/\s+/g, ' ').trim();

export const validateTypeImg = (type: string, arrayType: string[]) => {
  return arrayType.indexOf(type) !== -1;
};

export const validateSizeImg = (size: number, maxSize: number) => {
  return size / 1024 / 1024 <= maxSize;
};

export const getGenderText = (gender?: number) => {
  switch (gender) {
    case VALUE_GENDER.MALE:
      return TEXT_GENDER.MALE;
    case VALUE_GENDER.FEMALE:
      return TEXT_GENDER.FEMALE;
    default:
      return TEXT_GENDER.OTHER;
  }
};

export const getIdentityVerificationTypeText = (cardType?: number) => {
  if (cardType) return IDENTITY_VERIFICATION_TYPE_TEXT[cardType - 1];
  return '';
};

export const GetUpgradeShopRequestStatusText: (status?: number) => string = (status?: number) => {
  switch (status) {
    case UPGRADE_SHOP_REQUEST_STATUS_VALUE.APPROVED:
      return UPGRADE_SHOP_REQUEST_STATUS_TEXT.APPROVED;
    case UPGRADE_SHOP_REQUEST_STATUS_VALUE.WAIT_APPROVE:
      return UPGRADE_SHOP_REQUEST_STATUS_TEXT.WAIT_APPROVE;
    case UPGRADE_SHOP_REQUEST_STATUS_VALUE.DENIED:
      return UPGRADE_SHOP_REQUEST_STATUS_TEXT.DENIED;
    case UPGRADE_SHOP_REQUEST_STATUS_VALUE.WAIT_STRIPE:
      return UPGRADE_SHOP_REQUEST_STATUS_TEXT.WAIT_STRIPE;
    case UPGRADE_SHOP_REQUEST_STATUS_VALUE.FAIL_STRIPE:
      return UPGRADE_SHOP_REQUEST_STATUS_TEXT.FAIL_STRIPE;
    default:
      return '';
  }
};

export const formatCurrencyNumber = (value?: number | string) => {
  if (value === undefined) return '';
  return new Intl.NumberFormat('ja-JP').format(Number(value)).replace(/\./g, '.');
};

export const handleExportExcel = async (url: string, params: any, fileName: string, callback?: () => void) => {
  try {
    const res = await sendCustom({
      url,
      params,
      responseType: 'blob',
    });

    const blob = new Blob([res.data], { type: res.data.type });
    const link = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('download', fileName);
    a.setAttribute('href', link);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (callback) {
      callback();
    }
  } catch (error) {
    if (callback) {
      callback();
    }
  }
};

export const getDayWeek = (daysArr?: string) => {
  const convertedDays = daysArr && daysArr.split(',').map(Number);
  if (convertedDays)
    return convertedDays
      .map((item: number) => {
        switch (item) {
          case 0:
            return i18next.t('dayOfWeek.su');
          case 1:
            return i18next.t('dayOfWeek.mo');
          case 2:
            return i18next.t('dayOfWeek.tu');
          case 3:
            return i18next.t('dayOfWeek.we');
          case 4:
            return i18next.t('dayOfWeek.th');
          case 5:
            return i18next.t('dayOfWeek.fr');
          case 6:
            return i18next.t('dayOfWeek.sa');
          default:
            break;
        }
        return null;
      })
      .map((_item, _index: number) => {
        if (_index === 0) return _item;
        return ', ' + _item;
      });
};

export const handlePreventInvalidInputNumber: React.KeyboardEventHandler<HTMLInputElement | Element> = (
  e: React.KeyboardEvent
) => {
  ['e', 'E', '+', '-', '.', ','].includes(e.key) && e.preventDefault();
};

export const handleScroll = (event: React.UIEvent<HTMLElement>, hasNextPage?: boolean, fetchNextPage?: () => void) => {
  if (event) {
    const bottom =
      Math.ceil(event.currentTarget.scrollHeight - event.currentTarget.scrollTop) ===
        Math.ceil(event.currentTarget.clientHeight) ||
      Math.ceil(event.currentTarget.scrollHeight) - Math.ceil(event.currentTarget.scrollTop) ===
        Math.ceil(event.currentTarget.clientHeight);

    if (bottom && hasNextPage) {
      fetchNextPage && fetchNextPage();
    }
  }
};

export const formatPhone = (phone: string) => {
  if (!phone) return;
  if (phone.length === 10) {
    return phone.substring(0, 3) + '-' + phone.substring(3, 6) + '-' + phone.substring(6, 10);
  } else {
    return phone.substring(0, 3) + '-' + phone.substring(3, 7) + '-' + phone.substring(7, 11);
  }
};

export const compareDurationInSameDay = (time1: number) => {
  if (time1 < 60) {
    return `${time1}${i18next.t('common.second')}`;
  } else if (time1 >= 60 && time1 < 3600) {
    return `${Math.floor(time1 / 60)}${i18next.t('common.minutes')}${i18next.t('common.before')}`;
  } else if (time1 >= 3600 && time1 < 86400) {
    return `${Math.floor(time1 / 3600)}${i18next.t('common.hour')}`;
  } else if (time1 >= 86400 && time1 < 86400 * 30) {
    return `${Math.floor(time1 / 86400)}${i18next.t('common.day')}${i18next.t('common.before')}`;
  } else if (time1 >= 86400 * 30 && time1 < 86400 * 365) {
    return `${Math.floor(time1 / (86400 * 30))}${i18next.t('common.month')}${i18next.t('common.before')}`;
  } else {
    return `${Math.floor(time1 / (86400 * 365))}${i18next.t('common.year')}${i18next.t('common.before')}`;
  }
};

export const checkPriceDiscount = (price: number, price_discount: number) => {
  if (price === price_discount) return null;
  return price;
};

export const isToday = (date: string) => {
  if (dayjs().format('YYYY/MM/DD') === dayjs(date).format('YYYY/MM/DD')) {
    return true;
  }
  return false;
};

export const isYesterday = (date: string) => {
  if (dayjs().add(-1, 'day').format('YYYY/MM/DD') === dayjs(date).format('YYYY/MM/DD')) {
    return true;
  }
  return false;
};

export const showTimeChatMessenger = (textYesterday: string, value: string, isInBoxChat: boolean = true) => {
  const days = [
    i18next.t('dayOfWeek.su'),
    i18next.t('dayOfWeek.mo'),
    i18next.t('dayOfWeek.tu'),
    i18next.t('dayOfWeek.we'),
    i18next.t('dayOfWeek.th'),
    i18next.t('dayOfWeek.fr'),
    i18next.t('dayOfWeek.sa'),
  ];
  if (isToday(value)) {
    return dayjs(value).format('HH:mm');
  }
  if (isYesterday(value)) {
    return textYesterday;
  }
  if (isInBoxChat) {
    return days[dayjs(value).day()] + ' , ' + dayjs(value).format('MM/DD');
  }
  return dayjs(value).format('YYYY/MM/DD');
};

export const compareTimeWithHourMessenger = (time1: string, time2: string) => {
  if (Math.abs(dayjs(time2).diff(dayjs(time1), 'minutes')) > MINUTES_INTERVAL_BETWEEN_TWO_TIMES) {
    return true;
  }
  return false;
};

export const checkLinkProductDetail = (message: string) => {
  const linkProductDetail = configs.USER_DOMAIN + '/products/';
  const indexLink = message.indexOf(linkProductDetail);

  if (indexLink !== -1) {
    const productId = message.slice(linkProductDetail.length);
    return Number(productId);
  }
  return 0;
};

export const deleteAllCookies = () => {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export const formatCurrencyNumberToFixed = (value?: number | string) => {
  if (value === undefined || !value) return 0;
  const fixedValue: string = Number(value).toFixed(2);
  return new Intl.NumberFormat('ja-JP').format(Number(fixedValue)).replace(/\./g, '.');
};

export const handleEnterDatePickerInForm = (
  e: React.KeyboardEvent<HTMLInputElement>,
  form: FormInstance<any>,
  keyName: string
) => {
  if (e.key === 'Enter' || e.keyCode === 13) {
    const date = new Date(e.currentTarget.value);
    if (String(date) !== 'Invalid Date') {
      form.setFieldsValue({
        [keyName]: moment(date),
      });
      form.validateFields([keyName]);
    }
  }
};

export const compressionHeicImageFile = async (
  info: UploadChangeParam<any>,
  setUrl: (value: React.SetStateAction<string>) => void,
  setFile: (value: React.SetStateAction<string | Blob | undefined>) => void,
  setLoading?: (value: React.SetStateAction<boolean>) => void,
  maxSizeMB?: number
) => {
  if (info.file.name.toLowerCase().includes('.heic')) {
    // tslint:disable-next-line: no-floating-promises
    heic2any({ blob: info.file, toType: 'image/jpg', quality: 1 }).then(async (newImage: any) => {
      const options = {
        maxSizeMB: maxSizeMB ? maxSizeMB : IMAGE_CATEGORY_MAX_SIZE_MB,
        maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT_IMAGE,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(newImage, options);
      const url = URL.createObjectURL(compressedFile);
      setUrl(url);
      setFile(compressedFile);
      if (setLoading) {
        setLoading(false);
      }
      return compressedFile;
    });
  } else {
    setUrl(URL.createObjectURL(info.file));
    URL.revokeObjectURL(info.file);
    setFile(info.file);
    if (setLoading) {
      setLoading(false);
    }
  }
};
