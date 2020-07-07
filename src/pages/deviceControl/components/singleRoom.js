import React from 'react';
import { Tooltip } from 'antd';
import styles from '../index.less';
import { getImgUrl, getSingleTooltip } from '@/pages/deviceControl/components/someFunc';
const SingleRoom = ({
  name,
  loading,
  id,
  checkStatus,
  classroomStatus,
  masterEquipment,
  baseEquipment,
  moduleStatus,
}) => {
  const selectSingle = event => {
    event.nativeEvent.stopImmediatePropagation();
  };

  return (
    <Tooltip
      placement="bottomRight"
      title={() => getSingleTooltip(classroomStatus, masterEquipment, moduleStatus)}
      autoAdjustOverflow
      color="#031121"
    >
      <div
        onClick={selectSingle}
        className={`${styles.singleRoom} ${classroomStatus === 'on' && styles.active}`}
      >
        {checkStatus && (
          <img src={require('../../../assets/deviceControl/right.png')} alt="checked" />
        )}
        <div className={styles.cmWrapper}>
          {moduleStatus === 'off' && <span>C</span>}
          {/*<span>M</span>*/}
        </div>
        <h4>{name}</h4>
        <section>
          {masterEquipment.map((i, index) => (
            <img key={index} src={getImgUrl(i)} />
          ))}
        </section>
        {loading && (
          <div className={styles.spinner}>
            <div className={styles.bounce1}></div>
            <div className={styles.bounce2}></div>
            <div className={styles.bounce3}></div>
            <div className={styles.bounce4}></div>
            <div className={styles.bounce5}></div>
          </div>
        )}
      </div>
    </Tooltip>
  );
};
export default SingleRoom;
