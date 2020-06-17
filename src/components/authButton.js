import React, { Component, Fragment, useState } from 'react';
import { connect } from 'dva';

const AuthComponent = (WrappedComponent) =>
  connect(({ global }) => ({
    auth: global.auth,
  }))(({ onClick, className, auth, children }) => {
    const btnProps = {
      onClick,
      className,
      children,
    };
    const [isShow, setShow] = useState(true);
    if (auth.length) {
      const authArr = auth;
      const getRealAuth = (arr) =>
        arr.filter((item) => {
          if (item.children && item.children.length) return getRealAuth(item.children);
          return item.route === window.location.pathname;
        });

      console.log(getRealAuth(auth));
    }
    return isShow ? <WrappedComponent {...btnProps} /> : null;
  });
export default AuthComponent;
// export default connect(({ global }) => ({
//   moreMenu: global.moreMenu,
// }))(AuthComponent);
