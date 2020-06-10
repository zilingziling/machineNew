import { Spin } from 'antd';
import React from 'react';
import styles from './pageloaing.less';
const PageLoading = () => {
  return (
    <div className={styles.example}>
      <Spin />
    </div>
  );
};
export default PageLoading;
