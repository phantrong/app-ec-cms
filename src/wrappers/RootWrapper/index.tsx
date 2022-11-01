import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthWrapper from 'wrappers/AuthWrapper';

import styles from '../../styles/styles.module.scss';

const NotFound = lazy(() => import('pages/Page404'));
const Login = lazy(() => import('pages/Login'));
const ForgotPassword = lazy(() => import('pages/ForgotPassword'));
const ResetPassword = lazy(() => import('pages/ResetPassword'));
const Tasks = lazy(() => import('pages/Tasks'));
const SearchProduct = lazy(() => import('pages/SearchProduct'));
const ListCategory = lazy(() => import('pages/ListCategory'));
const ListBrand = lazy(() => import('pages/ListBrand'));
const ListUpgradeShopRequest = lazy(() => import('pages/ListUpgradeShopRequest'));
const UpgradeShopRequestDetail = lazy(() => import('pages/UpgradeShopRequestDetail'));
const ProductManagement = lazy(() => import('pages/ProductManagement'));
const DashBoardTurnOver = lazy(() => import('pages/TurnOverManagement'));
const UserManagement = lazy(() => import('pages/UserManagement'));
const UserDetail = lazy(() => import('pages/UserManagement/UserDetail'));
const StoreManagement = lazy(() => import('pages/StoreManagement'));
const StoreDetail = lazy(() => import('pages/StoreManagement/StoreDetail'));
const Payouts = lazy(() => import('pages/Payouts/History'));
const DetailPayout = lazy(() => import('pages/Payouts/Detail'));
const ListLiveStreams = lazy(() => import('pages/ListLiveStreams'));
const LiveStream = lazy(() => import('pages/LiveStream'));
const UserChatManagement = lazy(() => import('pages/UserChatManagement'));
const StoreChatManagement = lazy(() => import('pages/StoreChatManagement'));
const ListOrders = lazy(() => import('pages/ListOrders'));
const OrderDetail = lazy(() => import('pages/OrderDetail'));
const SettingPassword = lazy(() => import('pages/SettingPassword'));
const ViewLiveStream = lazy(() => import('pages/ViewLiveStream'));

export default function AppWrapper() {
  return (
    <div className={styles.rootWrapper}>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cms/reset-password/:token/:emailHash" element={<ResetPassword />} />
        <Route path="/" element={<AuthWrapper />}>
          {/* Child route declaration */}
          <Route path="tasks" element={<Tasks />} />
          <Route path="search-product" element={<SearchProduct />} />
          <Route path="categories" element={<ListCategory />} />
          <Route path="categories/:categoryId" element={<ListBrand />} />
          <Route path="upgrade-shop-requests" element={<ListUpgradeShopRequest />} />
          <Route path="upgrade-shop-requests/detail/:requestId" element={<UpgradeShopRequestDetail />} />
          <Route path="products-management" element={<ProductManagement />} />
          <Route path="dashboard" element={<DashBoardTurnOver />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="user-management/:id" element={<UserDetail />} />
          <Route path="store-management" element={<StoreManagement />} />
          <Route path="store-management/:id" element={<StoreDetail />} />
          <Route path="payment" element={<Payouts />} />
          <Route path="payment/:payoutId" element={<DetailPayout />} />
          <Route path="/live-streams/:id" element={<LiveStream />} />
          <Route path="live-streams" element={<ListLiveStreams />} />
          <Route path="/view-live/:id" element={<ViewLiveStream />} />
          <Route path="user-management/chat-messenger/:userId" element={<UserChatManagement />} />
          <Route path="store-management/chat-messenger/:storeId" element={<StoreChatManagement />} />
          <Route path="list-orders" element={<ListOrders />} />
          <Route path="order-detail/:id" element={<OrderDetail />} />
          <Route path="setting-password" element={<SettingPassword />} />
        </Route>
      </Routes>
    </div>
  );
}
