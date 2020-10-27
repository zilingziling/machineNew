import React from 'react';
import styles from './index.less';
import { Button } from 'antd';
const Scene = () => {
  return (
    <section className={styles.sceneWrapper}>
      <Button className="shadowBtn">返回上一级</Button>
      <section className={styles.scenes}>
        <div className={styles.left}>
          <div className={styles.top}>
            <span>情景</span>
            <div className={styles.opes}>
              <img src={require('../../assets/images/jias.png')} alt="ope" />
              <img src={require('../../assets/images/bi.png')} alt="ope" />
              <img src={require('../../assets/images/deleteRed.png')} alt="ope" />
            </div>
          </div>
          <ul></ul>
        </div>
        <div className={styles.center}>
          <div className={styles.top}>
            <span>情景序列</span>
            <div className={styles.opes}>
              <img
                src={require('../../assets/images/deleteRed.png')}
                alt="ope"
                className={styles.ml1}
              />
              <Button className="shadowBtn">保存</Button>
            </div>
          </div>
        </div>
        <div className={styles.right}></div>
      </section>
    </section>
  );
};

export default Scene;
