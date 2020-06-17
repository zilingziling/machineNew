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
  const { moreMenu } = props;

  return (
    <Layout>
      <Sider>
        <div className={styles.side}>
          {moreMenu.map((item) => (
            <NavLink
              activeStyle={navActive}
              className={styles.sideLink}
              key={item.id}
              to={item.route}
            >
              {item.name}
            </NavLink>
          ))}

          {/*<Menu.Item key="2">nav 2</Menu.Item>*/}
          {/*<Menu.Item key="3">nav 3</Menu.Item>*/}
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
}))(NormalLayout);
