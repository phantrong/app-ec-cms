import i18next from 'i18next';

export const STATUS_CODE = {
  HTTP_UNAUTHORIZED: 401,
  HTTP_FORBIDDEN: 403,
  HTTP_BAD_REQUEST: 400,
  HTTP_UNPROCESSABLE_ENTITY: 422,
  HTTP_NOT_FOUND: 404,
  HTTP_NOT_ACCEPTABLE: 406,
  HTTP_INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_CODE_PASSWORD = {
  NOT_VALID: 'E001',
};

export const TOKEN_CMS = 'token';

export const DEFAULT_PAGE_ANTD = 1;
export const PAGE_PAGINATION_10 = 10;
export const PAGE_PAGINATION_12 = 12;

export const TYPE_BTN = {
  TYPE_ADD: 'type_btn_add',
  TYPE_EDIT: 'type_btn_edit',
  TYPE_ADD_STAFF: 'type_btn_add_staff',
  TYPE_BTN_NORMAL_EARTH_BG: 'type_btn_normal_earth_bg',
  TYPE_ADD_IMAGE: 'type_btn_add_image',
  TYPE_CONFIRM: 'type_btn_confirm',
  TYPE_ADD_SCHEDULE_LIVE: 'type_btn_add_schedule_live',
  TYPE_ADD_LIVE: 'type_btn_add_live',
  TYPE_TRANSPARENT_BG: 'type_transparent_bg',
  TYPE_EXPORT_CSV: 'type_export_csv',
  TYPE_ADD_TO_CART: 'type_add_to_cart',
  TYPE_BUY: 'type_buy',
};

export const NORMAL_VALIDATE = {
  MIN_0: 0,
  MAX_40: 40,
  MAX_200: 200,
  MAX_255: 255,
  MAX_4000: 4000,
  MAX_3000: 3000,
  MAX_30: 30,
  MAX_10: 10,
  MAX_100: 100,
  MAX_2_BILLIONS: 2000000000,
  MIN_1000: 1000,
  MAX_STOCK: 10000000,
};

export const MIN_LENGTH_PASSWORD = 8;
export const MAX_LENGTH_PASSWORD = 30;

export const WEEK: IWeek[] = [
  {
    id: 0,
    value: i18next.t('dayOfWeek.su'),
  },
  {
    id: 1,
    value: i18next.t('dayOfWeek.mo'),
  },
  {
    id: 2,
    value: i18next.t('dayOfWeek.tu'),
  },
  {
    id: 3,
    value: i18next.t('dayOfWeek.we'),
  },
  {
    id: 4,
    value: i18next.t('dayOfWeek.th'),
  },
  {
    id: 5,
    value: i18next.t('dayOfWeek.fr'),
  },
  {
    id: 6,
    value: i18next.t('dayOfWeek.sa'),
  },
];

// Responsive
export const IS_MOBILE_1024 = 1024;
export const IS_MOBILE_820 = 820;
export const IS_MOBILE_768 = 768;
export const IS_MOBILE_425 = 425;
export const IS_MOBILE_375 = 375;

// List Category
export const CATEGORY_DEFAULT_STATUS = 1;
export const BRAND_DEFAULT_STATUS = 1;
export const CATEGORY_CANT_DELETE_ERROR_CODE = 'H001';
export const LOCATION_NAME_REGEX = '^[ぁ-んァ-ン・ーヽヾ、一-龥a-zA-Z0-9]+( [ぁ-んァ-ン・ーヽヾ、一-龥a-zA-Z0-9]*)*$';
export const NAME_CATEGORY_MAX_LENGTH = 20;
export const ACCEPT_UPLOAD_CATEGORY_IMAGE_TYPE = '.jpg,.jpeg,.png,.heic,.jfif';
export const CATEGORY_IMAGE_TYPE = ['image/jpg', 'image/jpeg', 'image/png', 'image/heic', 'image/jfif', ''];
export const IMAGE_CATEGORY_MAX_SIZE_MB = 10;
export const MAX_WIDTH_OR_HEIGHT_IMAGE = 1920;

// List Upgrade Shop Request
export const UPGRADE_SHOP_REQUEST_STATUS_VALUE = {
  ALL: 0,
  APPROVED: 4,
  WAIT_APPROVE: 1,
  DENIED: 5,
  WAIT_STRIPE: 3,
  FAIL_STRIPE: 6,
};

export const UPGRADE_SHOP_REQUEST_STATUS_TEXT = {
  ALL: i18next.t('listUpgradeShopRequest.requestStatus.all'),
  APPROVED: i18next.t('listUpgradeShopRequest.requestStatus.approved'),
  WAIT_APPROVE: i18next.t('listUpgradeShopRequest.requestStatus.waitApprove'),
  DENIED: i18next.t('listUpgradeShopRequest.requestStatus.denied'),
  WAIT_STRIPE: i18next.t('listUpgradeShopRequest.requestStatus.waitStripe'),
  FAIL_STRIPE: i18next.t('listUpgradeShopRequest.requestStatus.failStripe'),
};

export const VALUE_GENDER = {
  MALE: 1,
  FEMALE: 2,
  OTHER: 3,
};

export const TEXT_GENDER = {
  MALE: i18next.t('common.gender.male'),
  FEMALE: i18next.t('common.gender.female'),
  OTHER: i18next.t('common.gender.other'),
};

export const IDENTITY_VERIFICATION_TYPE_TEXT = [
  i18next.t('common.identityVerificationTypeText.passpost'),
  i18next.t('common.identityVerificationTypeText.driverLicense'),
  i18next.t('common.identityVerificationTypeText.residenceCard'),
  i18next.t('common.identityVerificationTypeText.numberCard'),
  i18next.t('common.identityVerificationTypeText.residenceCertificate'),
  i18next.t('common.identityVerificationTypeText.other'),
];

export const IDENTITY_VERIFICATION_TYPE = {
  PASSPOST: 1,
  DRIVER_LICENSE: 2,
  RESIDENCE_CARD: 3,
  NUMBER_CARD: 4,
  RESIDENCE_CERTIFICATE: 5,
  OTHER: 6,
};

// C3006 : List products
export const STATUS_PRODUCT = {
  ALL: 0,
  IN_STOCK: 4,
  VIOLATION: 3,
  SOLD_OUT: 5,
  NO_PRODUCT: 2,
  PUBLIC_OR_PRIVATE: 1,
};
export const GET_STATUS_PRODUCT = {
  OUT_OR_HAVE_PRODUCTS_IN_STOCK: 1,
  HIDDEN_PRODUCTS: 2,
  VIOLATION: 3,
};

// C2007
export const DATE_FILTER_TURNOVER_OPTIONS = {
  DAY: '1',
  MONTH: '2',
  YEAR: '3',
};

export const DATE_UNIT = {
  YYYY_MM_DD: 'YYYY/MM/DD',
  YYYY_MM: 'YYYY/MM',
  YYYY: 'YYYY',
};

export const COLOR_RANDOM_COLUMN = [
  '#EF5946',
  '#D47845',
  '#FAAC47',
  '#264653',
  '#8ECAE6',
  '#CB997E',
  '#EE9B00',
  '#AE2012',
  '#FDE4CF',
  '#8EECF5',
  '#48CAE4',
  '#414833',
  '#560BAD',
  '#ADA7FF',
  '#F0E8D9',
  '#989A74',
  '#A6CAB0',
  '#60A8A0',
  '#3D5563',
  '#837A8D',
];

export const LIST_AGE = [
  `0${i18next.t('common.age')}`,
  `10${i18next.t('common.age')}`,
  `20${i18next.t('common.age')}`,
  `30${i18next.t('common.age')}`,
  `40${i18next.t('common.age')}`,
  `50${i18next.t('common.age')}`,
  `60${i18next.t('common.age')}`,
  `70${i18next.t('common.age')}`,
  `80${i18next.t('common.age')}`,
  `90${i18next.t('common.age')}`,
  `${i18next.t('common.others')}`,
];

export const OVER_30_DAYS = 30;
export const OVER_10_YEARS = 10;
export const OVER_24_MONTHS = 24;

// ===== payouts ======
export const BANK_TYPE_INDIVIDUAL = 1;
export const BANK_TYPE_COMPANY = 2;
export const STATUS_WITHDRAW_UPCOMING = 1;
export const STATUS_WITHDRAW_SUCCESS = 2;
export const STATUS_WITHDRAW_FAILED = 3;
export const STATUS_WITHDRAW = [
  {
    value: null,
    label: i18next.t('common.statusAll'),
    name: i18next.t('common.statusAll'),
    class: '',
  },
  // {
  //   value: STATUS_WITHDRAW_UPCOMING,
  //   label: i18next.t('payouts.statusWithDrawalUpComing'),
  //   name: i18next.t('payouts.statusWithDrawalUpComing'),
  //   class: 'upComping',
  // },
  {
    value: STATUS_WITHDRAW_SUCCESS,
    label: i18next.t('payouts.statusWithDrawalSuccess'),
    name: i18next.t('payouts.statusWithDrawalSuccess'),
    class: 'success',
  },
  {
    value: STATUS_WITHDRAW_FAILED,
    label: i18next.t('payouts.statusWithDrawalFailed'),
    name: i18next.t('payouts.statusWithDrawalFailed'),
    class: 'failed',
  },
];

// C2002 : List live streams
export const PREPARING_LIVE_STATUS = 0;
export const LIVE_NOW_STATUS = 1;
export const STREAMED_STATUS = 2;
export const STATUS_LIST_LIVE = {
  LIVE_SOON: 0,
  LIVE_NOW: 1,
  LIVE_END: 2,
};

// C2012: Chat Messenger User
export const STORE_KEY = 0;
export const USER_KEY = 1;
export const MINUTES_INTERVAL_BETWEEN_TWO_TIMES = 30;
export const MAX_LENGTH_MESSAGE = 8000;
export const MESSAGE_READED = 1;
export const PRIVATE_GROUP_CHAT_TYPE = 1;
export const PUBLIC_GROUP_CHAT_TYPE = 2;
export const STATUS_PAGE_MESSENGER = {
  IN_LIST_GROUP_CHAT: 1,
  IN_BOX_CHAT: 2,
  IN_GROUP_INFORMATION: 3,
};
export const GROUP_CHAT_STATUS = {
  CREATE_BY_STORE: 0,
  CREATE_BY_USER: 1,
  CREATED: 2,
};
export const ARRAY_GENDER_TEXT = [
  i18next.t('common.gender.male'),
  i18next.t('common.gender.female'),
  i18next.t('common.gender.other'),
];
// C2005 : List orders
export const STATUS_ORDERS = {
  DEFAULT: 0,
  WAIT_CONFIRM: 1,
  WAIT_FOR_GOOD: 2,
  SHIPPING: 3,
  SHIPPED: 4,
  CANCEL: 5,
};

// C3009 : Setting password
export const PASSWORD_REGEX = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9~!(){}@#$%^&*-_`.,"\']{8,}$';

// Forgot password
export const TYPE_CHECK_MAIL_RESET_PASSWORD = 1;
// eslint-disable-next-line
export const EMAIL_REGEX = '^([a-zA-Z0-9])+([a-zA-Z0-9+_.-]*)+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})$';

export const ROLE = {
  STORE: 1,
  USER: 2,
  CMS: 3,
};

export const AGORA_ERROR_CODE = {
  KEY_EXPIRED: 0,
  CANT_CONNECT_SOURCE: 1,
  CANT_START_SOURCE: 2,
};
