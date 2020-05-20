import React from 'react';
import { Button,Radio } from 'antd';
import styles from './warning.less'
import NotHandle from '@/pages/warning/notHandle';
const Warning =()=>{
  return (
    <div className={styles.wrap}>
      <Button className='shadowBtn'>批量处理</Button>
      <br />
      <Radio.Group defaultValue="1" buttonStyle="solid" className={styles.radio}>
        <Radio.Button value="1" className={`${styles.singleRadio} ${styles.clicked}`}>未处理</Radio.Button>
        <Radio.Button value="2" className={styles.singleRadio}>已处理</Radio.Button>
      </Radio.Group>
      <NotHandle/>
    </div>
  )
}
export default Warning
