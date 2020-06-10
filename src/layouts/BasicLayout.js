import React, { useEffect, useState } from 'react';
import styles from './basicLayout.less';
import NavLink from 'umi/navlink';
import Link from 'umi/link';
import { Dropdown, Menu, Modal } from 'antd';
import router from 'umi/router';
import { QuestionCircleFilled } from '@ant-design/icons';
import { getMenus } from '@/service/login';
const activeNav = {
  borderBottom: '2px solid rgba(234,190,54,1)',
};
const { confirm } = Modal;
const BasicLayout = props => {
  const [bg, setBg] = useState('');
  const [title, setTitle] = useState('更多功能');
  const { route } = props;
  // 获取菜单
  useEffect(() => {
    getMenus().then(r => {
      console.log(r);
    });
  }, []);
  const menus = route.routes.filter(item => item.path);
  const renderOverLay = routes => {
    const overLayMenus = routes.filter(item => item.path);
    return (
      <Menu className={styles.dropMenu} onClick={item => setTitle(item.key)}>
        {overLayMenus.map((item, index) => {
          return (
            <Menu.Item key={item.name} className={styles.menuItem}>
              <Link to={item.path} className={styles.link}>
                {item.name}
              </Link>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  return (
    <div className={styles.bodyWrap}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.title}>
            <img src={require('../assets/images/logo.png')} />
            <h1>弈简运维管控平台</h1>
          </div>
          <div className={styles.userInfo}>
            <img src={require('../assets/images/full.png')} alt="full" />
            <img src={require('../assets/images/avatar.png')} alt="avatar" />
            <span>{window.localStorage.getItem('account')}</span>
            <span onClick={showConfirm}>退出</span>
            <span>帮助</span>
          </div>
        </div>
        <div className={styles.menus}>
          {menus.map((item, index) => {
            if (item.path.includes('more')) {
              return (
                <Dropdown
                  key="more"
                  trigger={['click']}
                  overlay={renderOverLay(item.routes)}
                  className={`${styles.nav} ${styles.dropdown}`}
                  onVisibleChange={visible => setBg(visible)}
                >
                  <div className={`${styles.overlay} ${bg ? styles.bg : ''}`}>
                    <img src={require(`../assets/images/${item.icon}.png`)} />
                    <span>{title}</span>
                  </div>
                </Dropdown>
              );
            } else if (item.path.includes('bigData')) {
              return (
                <div onClick={goto} className={styles.nav} key="bigData">
                  <img src={require(`../assets/images/${item.icon}.png`)} />
                  <span>{item.name}</span>
                </div>
              );
            } else {
              return (
                <NavLink to={item.path} key={index} className={styles.nav} activeStyle={activeNav}>
                  <img src={require(`../assets/images/${item.icon}.png`)} />
                  <span>{item.name}</span>
                </NavLink>
              );
            }
          })}
        </div>
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};
export default BasicLayout;
const goto = () => {
  // window.location.href =
  //   window.location.protocol +
  //   "//" +
  //   window.location.hostname +
  //   ":" +
  //   bigdata +
  //   "/?route=hardware&type=bigdata&account=" +
  //   window.localStorage.getItem("userName");
};
const account = window.localStorage.getItem('account') || '';

function showConfirm() {
  confirm({
    title: `${account} 是否退出登录？`,
    okText: '确定',
    cancelText: '取消',
    icon: <QuestionCircleFilled />,
    onOk() {
      window.localStorage.clear();
      router.push('/login');
    },
    onCancel() {},
  });
}
