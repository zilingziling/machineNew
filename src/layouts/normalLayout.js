import React, { useEffect, useState } from 'react';
import styles from './basicLayout.less';
import { NavLink } from 'umi';
import { Layout, Menu } from 'antd';
import { connect } from 'dva';
const { Content, Sider } = Layout;
const navActive = {
  background: '#2986d4',
};
const NormalLayout = (props) => {
  // 获取菜单
  // useEffect(() => {
  //   props.dispatch({
  //     type: 'global/getAuth',
  //   });
  // }, []);
  const { moreMenu, assetsMenu, route } = props;
  const menus = route.path === '/more' ? moreMenu : route.path.includes('assets') ? assetsMenu : [];
  return (
    <Layout>
      <Sider>
        <div className={styles.side}>
          {menus.map((item) => (
            <NavLink
              activeStyle={navActive}
              className={styles.sideLink}
              key={item.id}
              to={item.route}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </Sider>

      <Content
        style={{
          padding: 24,
        }}
      >
        {props.children}
      </Content>
    </Layout>
  );
};
export default connect(({ global }) => ({
  moreMenu: global.moreMenu,
  assetsMenu: global.assetsMenu,
}))(NormalLayout);
