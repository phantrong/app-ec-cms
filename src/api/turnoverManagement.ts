import { sendGet } from './axios';

export const getRevenueByOrder = (params: ITurnOverByOrder) => sendGet('/api/cms/manager-revenue/order', params);
export const EXPORT_ORDER_API = '/api/cms/manager-revenue/order/export';

export const getRevenueByAge = (params: ITurnOverByAge) => sendGet('/api/cms/manager-revenue/age', params);
export const EXPORT_AGE_API = '/api/cms/manager-revenue/age/export';

export const getRevenueByBestSales = (params: ITurnOverByBestSales) =>
  sendGet('/api/cms/manager-revenue/product', params);
export const EXPORT_BEST_SALES_API = '/api/cms/manager-revenue/product/export';
