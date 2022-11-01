import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Modal } from 'antd';
import classNames from 'classnames';

import styles from './styles.module.scss';

import dropIcon from '../../assets/images/icons/icon-arrow-top.svg';
import dropWhiteIcon from '../../assets/images/icons/icon-arrow-top-white.svg';
import { useQueryClient } from 'react-query';
import useToggleSideNav from 'hooks/useToggleSideNav';
import { useTranslation } from 'react-i18next';
import { TOKEN_CMS } from 'constants/constants';
import Cookies from 'js-cookie';

const CATEGORY_ROUTE_KEY = '9';

const { confirm } = Modal;

interface IRoutes {
  key: string;
  text: string;
  url?: string;
  icon: JSX.Element;
  children?: {
    text?: string;
  };
  subUrl?: string;
}

const collapseIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7H21" stroke="#3B3B3B" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 12H21" stroke="#3B3B3B" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 17H21" stroke="#3B3B3B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const collapsedIcon = (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.57 5.93005L3.5 12.0001L9.57 18.0701"
      stroke="#3B3B3B"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.6699 12H3.66992"
      stroke="#3B3B3B"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function SideNav() {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState('');
  const queryClient = useQueryClient();
  const collapsed = useToggleSideNav();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    confirm({
      title: (
        <>
          <div>{t('common.confirmLogOut')}</div>
          <div>{t('common.isThatOkToLogOut')}</div>
        </>
      ),
      okText: t('common.btnOk'),
      cancelText: t('common.btnCancel'),
      icon: <></>,
      className: 'modal-confirm-normal',
      centered: true,
      onOk() {
        Cookies.remove(TOKEN_CMS);
        navigate('/login');
      },
    });
  };

  const routes: IRoutes[] = [
    {
      key: '1',
      text: 'ダッシュボード',
      url: '/dashboard',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.5 18.5C16.6 18.5 17.5 17.6 17.5 16.5V7.5C17.5 6.4 16.6 5.5 15.5 5.5C14.4 5.5 13.5 6.4 13.5 7.5V16.5C13.5 17.6 14.39 18.5 15.5 18.5Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 18.5C9.6 18.5 10.5 17.6 10.5 16.5V13C10.5 11.9 9.6 11 8.5 11C7.4 11 6.5 11.9 6.5 13V16.5C6.5 17.6 7.39 18.5 8.5 18.5Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: '2',
      text: 'ライブ配信管理',
      url: '/live-streams',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.53 20.42H6.21C3.05 20.42 2 18.32 2 16.21V7.79002C2 4.63002 3.05 3.58002 6.21 3.58002H12.53C15.69 3.58002 16.74 4.63002 16.74 7.79002V16.21C16.74 19.37 15.68 20.42 12.53 20.42Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.5202 17.1L16.7402 15.15V8.84001L19.5202 6.89001C20.8802 5.94001 22.0002 6.52001 22.0002 8.19001V15.81C22.0002 17.48 20.8802 18.06 19.5202 17.1Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.5 11C12.3284 11 13 10.3284 13 9.5C13 8.67157 12.3284 8 11.5 8C10.6716 8 10 8.67157 10 9.5C10 10.3284 10.6716 11 11.5 11Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: '3',
      text: '商品管理',
      url: '/products-management',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.16992 7.44L11.9999 12.55L20.7699 7.46997"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 21.61V12.54" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M9.9306 2.48L4.59061 5.45003C3.38061 6.12003 2.39062 7.80001 2.39062 9.18001V14.83C2.39062 16.21 3.38061 17.89 4.59061 18.56L9.9306 21.53C11.0706 22.16 12.9406 22.16 14.0806 21.53L19.4206 18.56C20.6306 17.89 21.6206 16.21 21.6206 14.83V9.18001C21.6206 7.80001 20.6306 6.12003 19.4206 5.45003L14.0806 2.48C12.9306 1.84 11.0706 1.84 9.9306 2.48Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.9998 13.24V9.58002L7.50977 4.09998"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: '4',
      text: '注文管理',
      url: '/list-orders',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22 6V8.42C22 10 21 11 19.42 11H16V4.01C16 2.9 16.91 2 18.02 2C19.11 2.01 20.11 2.45 20.83 3.17C21.55 3.9 22 4.9 22 6Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 7V21C2 21.83 2.93998 22.3 3.59998 21.8L5.31 20.52C5.71 20.22 6.27 20.26 6.63 20.62L8.28998 22.29C8.67998 22.68 9.32002 22.68 9.71002 22.29L11.39 20.61C11.74 20.26 12.3 20.22 12.69 20.52L14.4 21.8C15.06 22.29 16 21.82 16 21V4C16 2.9 16.9 2 18 2H7H6C3 2 2 3.79 2 6V7Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6 9H12" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.75 13H11.25" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      subUrl: '/order-detail',
    },
    {
      key: '5',
      text: '支払い管理',
      url: '/payment',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 8.5H14.5"
            stroke="#888888"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 16.5H8"
            stroke="#888888"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 16.5H14.5"
            stroke="#888888"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 14.03V16.11C22 19.62 21.11 20.5 17.56 20.5H6.44C2.89 20.5 2 19.62 2 16.11V7.89C2 4.38 2.89 3.5 6.44 3.5H14.5"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 9.5V3.5L22 5.5"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M20 3.5L18 5.5" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      key: '6',
      text: 'ユーザー管理',
      url: '/user-management',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26003 15 3.41003 18.13 3.41003 22"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: '7',
      text: '出店申込者管理',
      url: '/upgrade-shop-requests',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.6992 18.98H7.29922C6.87922 18.98 6.40922 18.65 6.26922 18.25L2.12922 6.66999C1.53922 5.00999 2.22922 4.49999 3.64922 5.51999L7.54922 8.30999C8.19922 8.75999 8.93922 8.52999 9.21922 7.79999L10.9792 3.10999C11.5392 1.60999 12.4692 1.60999 13.0292 3.10999L14.7892 7.79999C15.0692 8.52999 15.8092 8.75999 16.4492 8.30999L20.1092 5.69999C21.6692 4.57999 22.4192 5.14999 21.7792 6.95999L17.7392 18.27C17.5892 18.65 17.1192 18.98 16.6992 18.98Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6.5 22H17.5" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.5 14H14.5" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      key: '8',
      text: '店舗管理',
      url: '/store-management',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.00977 11.22V15.71C3.00977 20.2 4.80977 22 9.29977 22H14.6898C19.1798 22 20.9798 20.2 20.9798 15.71V11.22"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.0005 12C13.8305 12 15.1805 10.51 15.0005 8.68L14.3405 2H9.67048L9.00048 8.68C8.82048 10.51 10.1705 12 12.0005 12Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.3108 12C20.3308 12 21.8108 10.36 21.6108 8.35L21.3308 5.6C20.9708 3 19.9708 2 17.3508 2H14.3008L15.0008 9.01C15.1708 10.66 16.6608 12 18.3108 12Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.64037 12C7.29037 12 8.78037 10.66 8.94037 9.01L9.16037 6.8L9.64037 2H6.59037C3.97037 2 2.97037 3 2.61037 5.6L2.34037 8.35C2.14037 10.36 3.62037 12 5.64037 12Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 17C10.33 17 9.5 17.83 9.5 19.5V22H14.5V19.5C14.5 17.83 13.67 17 12 17Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: CATEGORY_ROUTE_KEY,
      text: 'マスターデータ',
      url: '/categories',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      children: {
        text: 'カテゴリー',
      },
    },
    {
      key: '10',
      text: '設定',
      url: '/setting-password',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 9.10998V14.88C3 17 3 17 5 18.35L10.5 21.53C11.33 22.01 12.68 22.01 13.5 21.53L19 18.35C21 17 21 17 21 14.89V9.10998C21 6.99998 21 6.99999 19 5.64999L13.5 2.46999C12.68 1.98999 11.33 1.98999 10.5 2.46999L5 5.64999C3 6.99999 3 6.99998 3 9.10998Z"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: '11',
      text: 'ログアウト',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.90039 7.55999C9.21039 3.95999 11.0604 2.48999 15.1104 2.48999H15.2404C19.7104 2.48999 21.5004 4.27999 21.5004 8.74999V15.27C21.5004 19.74 19.7104 21.53 15.2404 21.53H15.1104C11.0904 21.53 9.24039 20.08 8.91039 16.54"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.9991 12H3.61914"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.85 8.64999L2.5 12L5.85 15.35"
            stroke="#3B3B3B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    routes.forEach((route) => {
      if (location.pathname.startsWith(route.url || '###')) {
        setSelectedKey(route.key);
      }
    });
  }, [location.pathname, routes]);

  useEffect(() => {
    routes.forEach((route) => {
      if (route?.subUrl && location.pathname.startsWith(route?.subUrl || '###')) {
        setSelectedKey(route.key);
      }
    });
  }, [location.pathname, routes]);

  const toggleSideNav = () => {
    queryClient.setQueryData('showSideNav', (value: boolean | undefined) => !value);
  };

  const handleClickSideNav = () => {
    if (collapsed) {
      toggleSideNav();
    }
  };

  return (
    <div
      className={classNames({
        [styles.sideNav]: true,
        [styles.sideNavCollapsed]: collapsed,
        [styles.isCollapsed]: !collapsed,
        sidenav: true,
      })}
    >
      <Menu
        selectedKeys={[selectedKey]}
        // defaultOpenKeys={['parent' + CATEGORY_ROUTE_KEY]}
        mode="inline"
        expandIcon={
          <img src={selectedKey === CATEGORY_ROUTE_KEY ? dropWhiteIcon : dropIcon} width={10} height={10} alt="drop" />
        }
        // inlineCollapsed={collapsed}
        className={classNames({
          [styles.antMenu]: true,
        })}
      >
        <Menu.Item key="0" icon={collapsed ? collapsedIcon : collapseIcon} onClick={toggleSideNav}>
          <a href="#toggle" onClick={(e) => e.preventDefault()}>
            {collapsed ? t('sideNav.menu') : ''}
          </a>
        </Menu.Item>
        {routes.map((route, index) => {
          if (route?.children && collapsed) {
            return (
              <Menu.SubMenu
                key={'parent' + route.key}
                className={selectedKey === route.key ? styles.activeSubMenu : ''}
                title={
                  <Menu.Item key={route.key} icon={route.icon}>
                    <Link to={route.url || ''} onClick={handleClickSideNav}>
                      {collapsed ? route.text : ''}
                    </Link>
                  </Menu.Item>
                }
              >
                <Menu.Item key={'sub' + route.key}>
                  <div>{route.children.text}</div>
                </Menu.Item>
              </Menu.SubMenu>
            );
          }
          return (
            <>
              {index < routes.length - 1 ? (
                <Menu.Item key={route.key} icon={route.icon}>
                  <Link to={route.url || ''} onClick={handleClickSideNav}>
                    {route.text}
                  </Link>
                </Menu.Item>
              ) : (
                <Menu.Item key={route.key} icon={route.icon} onClick={handleLogout}>
                  {t('header.logout')}
                </Menu.Item>
              )}
            </>
          );
        })}
      </Menu>
    </div>
  );
}
