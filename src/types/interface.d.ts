// General
declare interface IErrorResponse {
  response: {
    data: {
      data: any;
    };
    status?: number;
  };
}

interface IWeek {
  id: number;
  value: string;
}

declare interface SearchProductInputStylesInterface {
  width?: number;
  height?: number;
  border?: string;
  borderRadius?: number;
}

declare interface SearchProductInterface {
  styles?: SearchProductInputStylesInterface;
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
  isShowClear?: boolean;
}

declare interface ILoginParams {
  email: string;
  password: string;
}

declare interface ICmsProfile {
  id: string;
  email: string;
  avatar: string;
  name: string;
}
declare interface ICmsProfileResponse {
  data?: ICmsProfile;
  isLoading: boolean;
}

declare interface IURLImageComponentProps {
  src?: string | null;
  alt: string;
  className?: string;
  handleOnClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

// List Category

declare interface IFilterListCategory {
  start_date: string | null;
  end_date: string | null;
  name: string | null;
  page: number;
  per_page: number;
}

declare interface ICategoryDetail {
  id: number;
  name: string;
  image_path: string;
  created_at: string;
  status: number;
  brands_count: number;
}

declare interface IBrandDetail {
  id: number;
  name: string;
  created_at: string;
  status: number;
}

declare interface ICategoryStatus {
  status: number;
  total: number;
}

declare interface IResponseDataListCategory {
  data?: {
    categories: {
      data?: ICategoryDetail[];
      total: number;
    };
    status: ICategoryStatus[];
  };
  isLoading: boolean;
}

declare interface IResponseDataCategoryDetail {
  data?: {
    brands: {
      data?: IBrandDetail[];
      total: number;
    };
    status: ICategoryStatus[];
  };
  isLoading: boolean;
}

declare interface IColumnTable {
  title?: JSX.Element;
  dataIndex?: string;
  key?: string;
  className: string;
  render?: any;
}

declare interface ICommonDatePickerProps {
  className?: string;
  valueDate: string | null;
  formatDate: string;
  handleChange: (dateString: string) => void;
}

declare interface IBasicSucessResponse {
  success: boolean;
}

declare interface IDataCategoryForm {
  name: string;
  image: string;
  status: number;
}

declare interface IBrandFormData {
  name: string;
  category_id?: number;
  status: number;
}

// List Upgrade Shop Request
declare interface IFilterListUpgradeShopRequest {
  status: number;
  page: number;
  per_page: number;
}

declare interface IUpgradeShopRequestBasicDetail {
  id: number;
  store_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: number;
}

declare interface IUpgradeShopRequestDetail {
  id: number;
  store_id: number;
  company: string;
  store_name: string;
  postal_code: string;
  province: {
    id: number;
    name: string;
  };
  city: string;
  place: string;
  address: string;
  fax: string | null;
  phone: string;
  description: string;
  customer_id: number;
  person_stripe_id: number | null;
  first_name: string;
  last_name: string;
  first_name_furigana: string;
  last_name_furigana: string;
  gender: number;
  birthday: string;
  position: string;
  image_type: number;
  image_card_first: string;
  image_card_second: string;
  store_address: string;
  store_city: string;
  store_id: number;
  store_name: string;
  store_phone: string;
  store_place: string;
  store_postal_code: string;
  store_province: string;
  status: number;
  link: string;
  customer_email: string;
  bank_customer_name: string;
  bank_name: string;
  bank_number: string;
  bank_type: number;
  birthday: string;
  branch_name: string;
}

declare interface IListUpgradeShopRequestResponseData {
  data?: {
    data?: IUpgradeShopRequestBasicDetail[];
    total: number;
    from: number;
    to: number;
  };
  isLoading: boolean;
}

declare interface IUpgradeShopRequestDetailResponseData {
  data?: IUpgradeShopRequestDetail;
  isLoading: boolean;
}

declare interface IDataColumnTableUpgradeShopRequest {
  key: number;
  id: number;
  name: string;
  email: string;
  phone: string;
  statusBtn: JSX.Element;
  handle: JSX.Element;
}

declare interface IApproveUpgradeShopRequestParams {
  email: string;
  store_id?: number;
}

declare interface ISelect {
  value?: string | number | null | object;
  name?: string;
}

declare interface IUpgradeShopRequestCount {
  status: number;
  quantity: number;
}

declare interface IUpgradeShopRequestCountResponse {
  data?: IUpgradeShopRequestCount[];
  isLoading: boolean;
  isFetching: boolean;
}

// C3006 : Products management
declare interface IFilterListProduct {
  name: string | null;
  status?: string | null;
  price_max: double | null;
  price_min: double | null;
  page: number;
  per_page: number;
}

declare interface IProductType {
  type_name: string;
}

declare interface IPrice {
  price_min: number | null;
  price_max: number | null;
  page: number;
}

declare interface IProductClasses {
  id: number;
  product_id: number;
  price: number;
  discount?: number;
  product_type_configs: IProductType[];
  stock: number;
  total_product: number;
  revenue?: number;
}

declare interface IProductMedias {
  id: number;
  media_path: string;
  product_id: number;
}

declare interface IBasicInformationProduct {
  id: number;
  min_price: string;
  price: string;
  discount: string;
  description: string;
  max_price: string;
  max_discount: string;
  min_discount: string;
  name: string;
  product_classes: IProductClasses[];
  product_medias: IProductMedias[];
  status: number;
  stock: number;
  store: {
    id: number;
    name: string;
  };
}

declare interface IDataListProduct {
  data?: {
    products: {
      data: IBasicInformationProduct[];
      total: number;
      from: number;
      to: number;
    };
    status_filter: {
      status: number;
      quantity: number;
    }[];
  };
  isLoading: boolean;
}

declare interface IMarkViolation {
  id?: number;
  violation_reason: string;
  is_mark_violation: boolean;
}
// C2006 : Turnover
declare interface ITurnOverByOrder {
  type?: string | null;
  start_date?: Moment | null | undefined;
  end_date?: Moment | null | undefined;
}

declare interface IDataTurnoverByOrder {
  average: number;
  customer_female: string;
  customer_male: string;
  customer_not_login: string;
  customer_unknown: string;
  date: string;
  number_order: number;
  revenue: number;
}

declare interface IResponseTurnoverByOrder {
  data?: IDataTurnoverByOrder[];
  isLoading: boolean;
}

declare interface ITurnOverByAge {
  start_date?: string;
  end_date?: string;
}

declare interface IDataTurnOverByAge {
  total_order: number;
  revenue: number;
}

declare interface IResponseTurnoverByAge {
  data?: IDataTurnOverByAge[];
  isLoading: boolean;
}

declare interface ITurnOverByBestSales {
  start_date?: string;
  end_date?: string;
}

declare interface IDataTurnOverByBestSales {
  name: string;
  revenue: string;
  total_order?: number;
  total_product?: string;
  average?: string;
}

declare interface IResponseTurnoverByBestSales {
  data?: IDataTurnOverByBestSales[];
  isLoading: boolean;
}

// C2010 : List user
declare interface IFilterListUsers {
  page?: any;
  per_page?: number;
  name?: string | null;
  start_date: string | null;
  end_date: string | null;
}

declare interface IUserData {
  city: string;
  created_at: string;
  email: string;
  home_address: string;
  id: number;
  name: string;
  phone: string;
  place: string;
  province_name: string;
  surname: string;
}

declare interface IListUsersResponse {
  data?: {
    data?: IUserData[];
    total: number;
    from: number;
    to: number;
  };
  isLoading: boolean;
}

// C2011 : Detail User
declare interface IUserDetail {
  avatar: string | null;
  city: string;
  created_at: string;
  email: string;
  home_address: string;
  id: number;
  name: string;
  phone: string;
  place: string;
  province_name: string;
  surname: string;
  birthday: string;
  gender: number;
}
declare interface IUserDetailResponse {
  data?: IUserDetail;
  isLoading: boolean;
}

// C3004 : List stores
declare interface IFilterListStores {
  page?: unknown;
  per_page?: number;
  name?: string | null;
  start_date: string | null;
  end_date: string | null;
}

declare interface IStoreData {
  address: string;
  created_at: string;
  id: number;
  mail: string;
  name: string;
  phone: string;
  revenue_store: number;
}

declare interface IListStoresResponse {
  data?: {
    data?: IStoreData[];
    total: number;
    from: number;
    to: number;
  };
  isLoading: boolean;
}

declare interface IStoreDetailResponse {
  data?: IStoreDetail;
  isLoading: boolean;
}

// C3005 : Detail User
declare interface IStoreDetail {
  acc_stripe_id: string;
  address: string;
  address_detail?: string;
  avatar: string;
  city: string;
  code: string;
  company: string;
  cover_image: string;
  commission: string;
  date_start: string;
  date_approved: string;
  description: string;
  mail: string;
  fax: string;
  id: number;
  link: string | null;
  link_instagram: string | null;
  name: string;
  phone: string;
  place: string;
  postal_code: string;
  province: { id: number; name: string };
  province_id: number;
  revenue_store: string;
  revenue_total: string;
  status: number;
  stripe: { id: number; customer_id: number; person_stripe_id: number | null; first_name: string; last_name: string };
  time_end: string;
  time_start: string;
  total_livestream: number;
  total_order: number;
  total_product: number;
  total_revenue: number;
  work_day: string;
  customer: {
    id: number;
    mail: string;
  };
}

declare interface ISettingFeeStore {
  id: number;
  commission: number;
}

// ========= C2007 : payout history ==========
declare interface IParamPaymentHistory {
  start_date?: string;
  end_date?: string;
  starting_after?: string;
  status?: string | null;
  store_name?: string | number | null;
  page?: number;
  per_page?: number;
}

declare interface IDataPayoutHistory {
  id: number;
  arrival_date: number;
  created: number;
  currency: string;
  method: string;
  amount: number;
  source_type: string;
  status: number;
  type: string;
  store_id: number;
  store_name: number;
  bank_id: string;
}

declare interface IResponsePayoutHistory {
  data?: {
    data?: IDataPayoutHistory[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
  };
  isLoading: boolean;
}

declare interface IPayoutHistoryStatus {
  value: number | null;
  name: string;
  class: string;
}

declare interface IPayoutDetail {
  store_id: number;
  store_name: string;
  arrival_date: number;
  currency: string;
  amount: number;
  status: number;
  bank_history?: {
    id: number;
    bank_number: string;
    customer_name: string;
    type: number;
    bank?: {
      id: number;
      name: string;
    };
    bank_branch?: {
      id: number;
      name: string;
    };
  };
}
declare interface IResponsePayoutDetail {
  data?: {
    data?: IPayoutDetail;
  };
  isLoading: boolean;
}

declare interface IDataPayoutDetail {
  data?: IPayoutDetail;
  isLoading: boolean;
}

declare interface IBankPresentStore {
  bank_code: string;
  bank_id: number;
  bank_name: string;
  bank_number: string;
  branch_id: number;
  branch_name: string;
  customer_name: string;
  type: number;
  address: string;
}

declare interface IResponseBankPresentStore {
  data?: {
    data?: IBankPresentStore;
  };
  isLoading: boolean;
}

declare interface IDataBankPresentStore {
  data?: IBankPresentStore;
  isLoading: boolean;
}

declare interface IResponseBankRetrieve {
  data?: {
    data?: {
      total: number;
    };
  };
  isLoading: boolean;
}

declare interface IDataBankRetrieve {
  data?: {
    total: number;
  };
  isLoading: boolean;
}

declare interface IWithdrawCountStatus {
  status: number;
  quantity: number;
}

declare interface IWithdrawCountStatusResponse {
  data?: IWithdrawCountStatus[];
  isLoading: boolean;
}

// C2002 : List live streams
declare interface IListLiveFilter {
  per_page?: number;
  page?: number;
  status?: string | null;
  start_date: string | null;
  end_date: string | null;
  key_word?: string | null;
}
declare interface IListLive {
  channel_name: string | null;
  id: number;
  image: string;
  staff: {
    id: number;
    name: string;
    store_id: number;
  };
  staff_id: number;
  start_time: string;
  status: number;
  store: {
    id: number;
    name: string;
    avatar?: string;
  };
  store_id: number;
  title: string;
  token: any;
  url_video: string | null;
  view: any;
  time_passed: number;
  has_link: number;
  violation: number | null;
}

declare interface IStatusNumberLive {
  status: number;
  total_schedule: number;
}
declare interface IListLiveResponse {
  data?: {
    schedules?: {
      data: IListLive[];
      total: number;
      from: number;
      to: number;
    };
    status: IStatusNumberLive[];
  };
  isLoading: boolean;
}

// C2012: Chat Messenger User
declare interface IProductDetailResponse {
  data?: IProductDetail;
  isLoading: boolean;
}

declare interface IProductDetail {
  id?: number;
  name: string;
  status: number;
  store_id: number;
  description: string;
  stock: number;
  property: string;
  min_price: string;
  max_price: string;
  min_discount: string;
  max_discount: string;
  product_medias: {
    product_id: number;
    media_type: number;
    media_path: string;
  }[];
  product_classes: IProductClasses[];
  product_type_config: {
    name: string;
    options: {
      id: number;
      type_name: string;
    }[];
  }[];
  sale: number;
  product_favorites: {
    id: number;
    product_id: number;
  }[];
  brand: {
    id: number;
    name: number;
  };
}

declare interface IStoreBasicDetail {
  id: number;
  name: string;
  avatar: string;
  cover_image: string;
  phone: string;
  time_start: string;
  time_end: string;
  work_day: string;
  address: string;
  address_detail?: string;
  total_product: number;
}

declare interface IStoreBasicDetailResponse {
  data?: IStoreBasicDetail;
  isLoading: boolean;
}

declare interface IMessengerListGroupChatProps {
  listGroupChat: IGroupChatDetail[];
  activeGroup?: IGroupChatDetail;
  setActiveGroup: React.Dispatch<React.SetStateAction<IGroupChatDetail | undefined>>;
  setPageStatus: React.Dispatch<React.SetStateAction<number>>;
  userProfile: IUserDetail;
  deletedMessageKeyId?: string;
  socket: Socket | null;
}

declare interface IMessageDetail {
  id: string;
  keyId: string;
  userId?: number;
  storeId?: number;
  content: string;
  createdAt: string;
  deletedAt: string | null;
  name?: string;
  avatar?: string;
}

declare interface IMessengerBoxChatProps {
  store?: IStoreBasicDetail;
  activeGroup?: IGroupChatDetail;
  pageStatus: number;
  setPageStatus: React.Dispatch<React.SetStateAction<number>>;
  newMessage?: IMessageDetail;
  userProfile: IUserDetail;
  setListGroupChat: React.Dispatch<React.SetStateAction<IGroupChatDetail[] | undefined>>;
  deletedMessageKeyId?: string;
  socket: Socket | null;
}

declare interface IMessengerGroupInfomationProps {
  store?: IStoreBasicDetail;
  pageStatus: number;
  setPageStatus: React.Dispatch<React.SetStateAction<number>>;
}

declare interface IMessengerLinkProductProps {
  productId: number;
  className?: string;
}

declare interface IGroupChatDetail {
  _id: string;
  type: number;
  read: number[];
  updateAt: string;
  people: {
    avatar: string;
    name: string;
    storeId?: number;
    userId?: number;
  }[];
  messages?: IMessageDetail[];
  audience?: {
    user: object;
    store: object;
  };
}

declare interface IDataResponseListGroupChatMessenger {
  data: IGroupChatDetail[];
  total: number;
  current_page: number;
  per_page: number;
}

declare interface IGetGroupChatInformationParams {
  store: string[];
  user: string[];
}

declare interface IPeopleInGroupChat {
  storeId?: number;
  userId?: number;
  name: string;
  avatar: string;
}

declare interface IGetGroupChatInformationDataResponse {
  data?: IPeopleInGroupChat[];
  isLoading: boolean;
}

declare interface IDataResponseHistoryChatMessenger {
  messages: IMessageDetail[];
  total: number;
}

declare interface IHistoryChatFilter {
  page: number;
}

declare interface IAddNewMessageParams {
  keyId: string;
  content: string;
  time: string;
  userId?: number;
  storeId?: number;
}

declare interface IExceptionErrorResponse {
  message: string;
  errorCode: number;
}

declare interface IDeleteMessageChatParams {
  messageKeyId: string;
  userId?: number;
  storeId?: number;
}

declare interface IGetHistoryChatParams {
  groupId: string;
  page: number;
}

declare interface IDataResponseNewMessage {
  message: IAddNewMessageParams;
  groupId: string;
  user: {
    avatar: string;
    name: string;
    userId: number;
  };
  store: {
    avatar: string;
    name: string;
    storeId: number;
  };
}

// C3005.1: Store Chat Management
declare interface IStoreMessengerListGroupChatProps {
  listGroupChat: IGroupChatDetail[];
  activeGroup?: IGroupChatDetail;
  setActiveGroup: React.Dispatch<React.SetStateAction<IGroupChatDetail | undefined>>;
  setPageStatus: React.Dispatch<React.SetStateAction<number>>;
  storeProfile: IStoreBasicDetail;
  deletedMessageKeyId?: string;
  socket: Socket | null;
}

declare interface IStoreMessengerBoxChatProps {
  userProfile?: IUserDetail;
  activeGroup?: IGroupChatDetail;
  pageStatus: number;
  setPageStatus: React.Dispatch<React.SetStateAction<number>>;
  newMessage?: IMessageDetail;
  storeProfile: IStoreBasicDetail;
  setListGroupChat: React.Dispatch<React.SetStateAction<IGroupChatDetail[] | undefined>>;
  deletedMessageKeyId?: string;
  socket: Socket | null;
}

declare interface IStoreMessengerGroupInfomationProps {
  user?: IUserDetail;
  pageStatus: number;
  setPageStatus: React.Dispatch<React.SetStateAction<number>>;
}
// C2005 : List orders
declare interface IFilterOrders {
  key_word?: string | null;
  start_date: string | null;
  end_date: string | null;
  per_page?: number;
  page?: number;
  status?: string | null;
}
declare interface IListOrders {
  code: string;
  created_at: string;
  customer_name: string;
  customer_surname: string;
  id: number;
  revenue_admin: string;
  status: number;
  store_name: string;
  total_payment: string;
  total_product: number;
}
declare interface IStatusNumberOrders {
  status: number;
  quantity: number;
}
declare interface IListOrdersResponse {
  data?: {
    orders?: {
      data: IListOrders[];
      total: number;
      from: number;
      to: number;
    };
    status_filter: IStatusNumberOrders[];
    revenue_admin: number;
    total_payment: number;
  };
  isLoading: boolean;
}

// C2006 : Detail order
declare interface IProductTypeConfig {
  type_name: string;
  name: string;
}

declare interface IDataProductDetail {
  product_class_id: number;
  price: string;
  quantity: number;
  product_class: {
    product_type_configs?: IProductTypeConfig[];
    product: {
      name: string;
      product_medias_image: {
        media_type: number;
        media_path: string;
      };
    };
  };
}
declare interface IOrderDetail {
  address_01: string;
  address_02: string;
  address_03: string;
  address_04: string;
  avatar: string;
  code: string;
  created_at: string;
  id: number;
  order_id: number;
  order_items: IDataProductDetail[];
  phone_number: string;
  postal_code: string;
  receiver_name: string;
  receiver_name_furigana: string;
  status: number;
  store_name: string;
  total_payment: string;
  updated_at: string;
}

declare interface IDataOrderDetail {
  data?: IOrderDetail;
  isLoading: boolean;
}

// C3008 : Change pass
declare interface IChangePasswordPostParams {
  old_password: string;
  password: string;
  password_confirm: string;
}

declare interface IChangePasswordFormParams {
  nowPassword: string;
  newPassword: string;
  confirmPassword: string;
}

declare interface ISettingDataResponse {
  message: string;
  success: boolean;
  errorCode?: string[];
}

// Forgot password
declare interface ICheckMailUniqueParams {
  email: string;
  type?: number;
}

declare interface IDataResponseResetPassword {
  message: string;
  success: boolean;
  data?: string;
  errorCode?: string[];
}

declare interface IResetPasswordParams {
  token: string;
  params: {
    password: string;
    password_confirm: string;
  };
}

declare interface IValidateLinkResetPasswordParams {
  token: string;
  email: string;
}

declare interface IPasswordParams {
  password: string;
  password_confirm: string;
}

declare interface LiveStreamDetailInterface {
  data?: {
    data?: {
      id: number;
      room_id: null | string;
      title: string;
      status: number;
      start_time: string;
      staff_id: number;
      store_id: number;
      staff: null | {
        id: number;
        name: string;
      };
      store: {
        id: 1;
        name: string;
        phone: string;
        avatar: string | null;
        work_day: string;
        address: string;
        time_start: string;
        time_end: string;
        products_count: number;
      };
      time_passed?: number;
      time_remain?: number;
      url_video?: string;
      view?: number;
    };
  };
  isLoading: boolean;
  isFetched: boolean;
}
declare interface ViewPortInterface {
  width: number;
  height: number;
}
