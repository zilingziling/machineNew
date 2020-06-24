import React, { useEffect, useState } from 'react';
import styles from './basicLayout.less';
import { NavLink } from 'umi';
import { Layout, Menu } from 'antd';
import { connect } from 'dva';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
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
          {menus.map((item) => {
            if (
              item.route === '/assetsManage/assetsMore' &&
              item.children &&
              item.children.length
            ) {
              return (
                // <Menu mode="inline" key={item.id}>
                //   <SubMenu
                //     key={item.id}
                //     defaultSelectedKeys={item.children[0].id}
                //     icon={<UserOutlined />}
                //     title={item.name}
                //   >
                //     {
                // console.log(item.children)
                item.children.map((i) => (
                  <NavLink
                    activeStyle={navActive}
                    className={styles.sideLink}
                    key={i.id}
                    to={i.route}
                  >
                    {i.name}
                  </NavLink>
                ))
                //     }
                //   </SubMenu>
                // </Menu>
              );
            } else {
              return (
                <NavLink
                  activeStyle={navActive}
                  className={styles.sideLink}
                  key={item.id}
                  to={item.route}
                >
                  {item.name}
                </NavLink>
              );
            }
          })}
        </div>
      </Sider>

      <Content
        style={{
          padding: 24,
        }}
      >
        {
          // console.log(props.children)
          props.children
        }
      </Content>
    </Layout>
  );
};
export default connect(({ global }) => ({
  moreMenu: global.moreMenu,
  assetsMenu: global.assetsMenu,
}))(NormalLayout);
