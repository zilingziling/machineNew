import React, { Component, Fragment, useEffect, useState } from 'react';
import { connect } from 'dva';

const AuthComponent = (WrappedComponent) =>
  connect(({ global }) => ({
    auth: global.auth,
  }))(({ onClick, className, auth, href, authName, children }) => {
    const btnProps = {
      onClick,
      className,
      children,
      href,
    };
    const [isShow, setShow] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (auth.length) {
        const getRealAuth = (arr) =>
          arr.find((item) => {
            if (item.route) {
              if (item.route === window.location.pathname) {
                return item;
              } else if (item.children && item.children.length) {
                return getRealAuth(item.children);
              }
            }
          });

        let arr = getRealAuth(auth[0].children);
        if (arr.children && arr.children.length) {
          let opeArr = arr.children.find((item) => item.route === window.location.pathname);
          if (opeArr.children && opeArr.children.length) {
            let r = opeArr.children.find(
              (item) => item.name === authName && item.type === 'operation',
            );
            setShow(!!r);
          }
        }
      }
    }, [auth]);

    return isShow ? <WrappedComponent {...btnProps} /> : null;
  });
export default AuthComponent;
// export default connect(({ global }) => ({
//   moreMenu: global.moreMenu,
// }))(AuthComponent);
