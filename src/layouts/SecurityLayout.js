import React, { useEffect, useState } from 'react';
import PageLoading from '@/components/pageLoading/pageLoading';
import { Redirect } from 'umi';
import { getMenus } from '@/service/login';
import { connect } from 'dva';
const SecurityLayout = props => {
  const [isReady, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  const token = window.localStorage.getItem('token');
  if (!isReady) return <PageLoading />;
  if (!token && window.location.pathname !== '/login') {
    return <Redirect to="/login" />;
  }
  return props.children;
};
export default connect(({ global }) => ({
  global,
}))(SecurityLayout);
