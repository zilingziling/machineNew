import styles from '@/pages/deviceControl/index.less';
import SingleRoom from '@/pages/deviceControl/components/singleRoom';
import React, { useEffect, useState } from 'react';

const Group = ({ item, singleProps, batch }) => {
  const [groupCheck, setGroupCheck] = useState(false);
  const [isGroupSelectAll, setIsGroupSelectAll] = useState(false);
  const onclickGroupCheck = () => {
    // setIsGroupSelectAll(!isGroupSelectAll);
    let data = singleProps.roomData;
    data.forEach(i => {
      if (i.groupId === item.groupId) {
        i.classroomData.forEach(j => (j.checkStatus = !isGroupSelectAll));
      }
    });
    singleProps.setRoomData(data.slice());
  };
  useEffect(() => {
    let a = item.classroomData.find(j => !j.checkStatus);
    if (a) {
      setIsGroupSelectAll(false);
    } else setIsGroupSelectAll(true);
  }, [singleProps.roomData]);
  return (
    <div className={styles.groupWrapper}>
      <h6>{item.group}</h6>
      {batch && (
        <img
          onClick={onclickGroupCheck}
          src={
            isGroupSelectAll
              ? require('../../../assets/deviceControl/checked.png')
              : require('../../../assets/deviceControl/check.png')
          }
          alt="check"
        />
      )}
      <div className={styles.rooms}>
        {item.classroomData.map((room, index) => (
          <SingleRoom {...singleProps} key={room.id} {...room} moduleStatus={item.moduleStatus} />
        ))}
      </div>
    </div>
  );
};
export default Group;
