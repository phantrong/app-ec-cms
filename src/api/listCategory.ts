import { sendDelete, sendGet, sendPost, sendPut } from './axios';

export const apiGetListCategory = (filter: IFilterListCategory) => sendGet('/api/cms/categories/list', filter);
export const apiDeleteCategory = (categoryId: number) => sendDelete('/api/cms/categories/' + categoryId);
export const apiAddCategory = (params: FormData) => sendPost('/api/cms/categories/create', params);
export const apiUpdateCategory = (categoryId: number, params: FormData) =>
  sendPost('/api/cms/categories/' + categoryId, params);
export const apiGetCategoryDetail = (categoryId: number, filter: IFilterListCategory) =>
  sendGet('/api/cms/categories/detail/' + categoryId, filter);
export const apiDeleteBrand = (brandId: number) => sendDelete('/api/cms/brands/' + brandId);
export const apiAddBrand = (params: IBrandFormData) => sendPost('/api/cms/brands/create', params);
export const apiUpdateBrand = (brandId: number, params: IBrandFormData) =>
  sendPut('/api/cms/brands/' + brandId, params);
