import React from 'react';
import styles from './index.less';
import { Button } from 'antd';
const Update = ({ title, info }) => {
  return (
    <div className={styles.updateWrapper}>
      <div className={styles.update}>
        <h2>{title}</h2>
        <p>{info}</p>
        <ul>
          <li>
            <div>
              <h2 className="red">当前固件版本为</h2>
              <h2>V2.7.7</h2>
            </div>
            <Button type="primary">升级区域</Button>
          </li>
          <li>
            <div>
              <h6>文件路径：</h6>
              <Button className="shadowBtn mr1">浏览</Button>
              <span>未选中文件</span>
            </div>
            <Button type="primary">上传文件</Button>
          </li>
        </ul>
        <section>
          <span>版本号</span>
          <span>文件名字</span>
          <span>上传日期</span>
        </section>
        <p className={styles.note}>注意：中控重启升级过程中为保证正常升级，请不要断电！</p>
      </div>
    </div>
  );
};
export default Update;
