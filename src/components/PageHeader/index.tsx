import React from 'react';
import Cookies from 'js-cookie';
import { Menu, Dropdown, Modal, Skeleton } from 'antd';
// import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.scss';
import useProfile from 'hooks/useProfile';
// import useToggleSideNav from 'hooks/useToggleSideNav';
import { TOKEN_CMS } from 'constants/constants';
// import CommonURLImage from 'components/CommonURLImage';
import logoutImg from 'assets/images/icons/logout.svg';
import dropdownIcon from 'assets/images/icons/icon-arrow-bottom.svg';
// import avatarIcon from 'assets/images/icons/avatar.svg';

const { confirm } = Modal;

export default function PageHeader() {
  const { t } = useTranslation();
  const isAuthenticated: boolean = !!Cookies.get(TOKEN_CMS);
  // const queryClient = useQueryClient();
  // const collapsed = useToggleSideNav();
  const navigate = useNavigate();
  const { data: profile, isLoading: isLoadingProfile }: ICmsProfileResponse = useProfile(isAuthenticated);

  // const routes = [
  //   {
  //     key: '1',
  //     text: 'ホーム',
  //     url: '/',
  //   },
  //   {
  //     key: '2',
  //     text: 'イベント一覧',
  //     url: '/',
  //   },
  //   {
  //     key: '3',
  //     text: '配信中のイベント',
  //     url: '/',
  //   },
  //   {
  //     key: '4',
  //     text: 'マイページ',
  //     url: '/',
  //   },
  // ];

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

  const menu = (
    <Menu style={{ minWidth: 200 }} className={styles.menuDropDown}>
      {/* <Menu.Item key="1" className={styles.menuOption}>
        <div className={styles.iconMenu}>
          <img src={avatarIcon} alt="avatar default" width={20} height={20} />
        </div>
        <span className={styles.textMenu}>{t('header.profile')}</span>
      </Menu.Item> */}
      <Menu.Item key="1" onClick={handleLogout} className={styles.menuOption}>
        <div className={styles.iconMenu}>
          <img src={logoutImg} width={20} height={20} alt="logout" />
        </div>
        <span className={styles.textMenu}>{t('header.logout')}</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.menuWrapper}>
        <div className={styles.logoHeader}>
          MY CART
          {/* <img src={logoHeader} alt="logo top" /> */}
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className={styles.menuContent}>
          {/* {routes.map((route) => (
            <Menu.Item key={route.key}>
              <Link to={route.url}>{route.text}</Link>
            </Menu.Item>
          ))} */}
        </Menu>
        <div className={styles.searchBox}></div>
        {/* <div className={styles.cartBox}>
          <img src={cart} alt="cart" />
        </div> */}
        {isLoadingProfile && <Skeleton.Button active className={styles.loadingProfileHeader} />}
        <div className={styles.menuItem}>
          {!isLoadingProfile && (
            <Dropdown overlay={menu} trigger={['click']} className={styles.nameStaff}>
              <div className={styles.dropdownToggle}>
                {/* <CommonURLImage className={styles.icon} src={profile?.avatar} alt="avatar user" /> */}
                <span className={styles.userName}>{profile?.name}</span>
                <img className={styles.iconDropdown} src={dropdownIcon} alt="dropdown" />
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
}
