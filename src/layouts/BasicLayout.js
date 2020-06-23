import React, { useEffect, useState } from 'react';
import styles from './basicLayout.less';
import { NavLink } from 'umi';
import { Link } from 'umi';
import { Dropdown, Menu, Modal } from 'antd';
import { history } from 'umi';
import { QuestionCircleFilled } from '@ant-design/icons';
import { connect, router } from 'dva';
const activeNav = {
  borderBottom: '2px solid rgba(234,190,54,1)',
};
const { confirm } = Modal;
const BasicLayout = (props) => {
  // 获取菜单
  useEffect(() => {
    props.dispatch({
      type: 'global/getAuth',
    });
  }, []);

  let menus = [];
  if (props.auth.length) {
    menus = props.auth[0].children;
  }
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
            if (item.route.includes('bigData')) {
              return (
                <div onClick={goto} className={styles.nav} key="bigData">
                  <img src={item.icon} />
                  <span>{item.name}</span>
                </div>
              );
            } else {
              return (
                <NavLink
                  // to={item.children.length ? item.children[0].route : item.route}
                  to={item.route}
                  key={index}
                  className={styles.nav}
                  activeStyle={activeNav}
                >
                  <img src={item.icon} />
                  <span>{item.name}</span>
                </NavLink>
              );
            }
          })}
        </div>
      </div>
      <div className="content">{props.children}</div>
    </div>
  );
};
export default connect(({ global }) => ({
  auth: global.auth,
  moreMenu: global.moreMenu,
}))(BasicLayout);
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
      history.push('/login');
    },
    onCancel() {},
  });
}
