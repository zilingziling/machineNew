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
  batch,
  moduleStatus,
  roomData,
  setRoomData,
  setButtons,
  buildingName,
  setSelectClassroomInfo,
}) => {
  const selectSingle = event => {
    event.nativeEvent.stopImmediatePropagation();
    const a = roomData;
    if (batch) {
      a.forEach(item => {
        item.classroomData.forEach(j => {
          // 多选
          if (j.id === id) {
            j.checkStatus = !j.checkStatus;
          }
        });
      });
    } else {
      a.forEach(item => {
        item.classroomData.forEach(classroom => {
          //  单选
          if (classroom.id === id) {
            classroom.checkStatus = true;
            setButtons(classroom.baseEquipment);
            setSelectClassroomInfo({
              name: buildingName + classroom.name,
              classStatus:
                classroom.classroomStatus === 'on'
                  ? '上课'
                  : classroom.classroomStatus === 'off'
                  ? '下课'
                  : '',
              classroomId: id,
            });
          } else {
            classroom.checkStatus = false;
          }
        });
      });
    }
    setRoomData(a.slice());
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
        className={`${styles.singleRoom} ${classroomStatus === 'on' ? styles.active : ''}`}
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
