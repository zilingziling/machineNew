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
const NormalLayout = props => {
  const { route } = props;
  const [show, setShow] = useState(false);
  const [menus, setMenus] = useState([]);
  useEffect(() => {
    const menuData = JSON.parse(window.localStorage.getItem('menuData'));
    const a = menuData[0].children.filter(item => item.route === '/more');
    const moreArr = a.length ? a[0].children : [];
    const b = menuData[0].children.filter(item => item.route === '/assetsManage');
    const assetsArr = b.length ? b[0].children : [];
    const menus1 =
      route.path === '/more' ? moreArr : route.path.includes('assets') ? assetsArr : [];
    setMenus(menus1);
  }, []);
  return (
    <Layout>
      <Sider>
        <div className={styles.side}>
          {menus.map(item => {
            if (
              item.route === '/assetsManage/assetsMore' &&
              item.children &&
              item.children.length
            ) {
              return (
                <div key={item.id} className={styles.dropStyle}>
                  <div className={styles.sideLink} onClick={() => setShow(!show)}>
                    <h1>{item.name}</h1>
                    <img
                      src={
                        show
                          ? require('../../src/assets/images/up.png')
                          : require('../../src/assets/images/down.png')
                      }
                    />
                  </div>
                  {show && (
                    <div className={styles.drop}>
                      {// console.log(item.children)
                      item.children.map(i => (
                        <NavLink
                          activeStyle={navActive}
                          className={styles.sideLink}
                          key={i.id}
                          to={i.route}
                          style={{ fontSize: '0.12rem' }}
                        >
                          {i.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
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
export default NormalLayout;
