import React, { useEffect, useState } from 'react';
import styles from '../index.less';
import { Button, Input, Tooltip, Empty } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getTooltips, initClassroomData } from '@/pages/deviceControl/components/someFunc';
import SingleRoom from '@/pages/deviceControl/components/singleRoom';
import { getClassrooms } from '@/service/deviceControl';
const ClassRooms = ({ schoolId }) => {
  const [roomData, setRoomData] = useState([]);
  const [buttons, setButtons] = useState([1, 2, 3, 4]);
  useEffect(() => {
    getClassrooms({ schoolId }).then(r => {
      if (r.code === 0) {
        setRoomData(initClassroomData(r.data));
      }
    });
  }, [schoolId]);
  const singleProps = {
    roomData,
    setRoomData,
  };
  return (
    <div className={styles.deviceControlWrapper}>
      <section className={styles.top}>
        <div className={styles.btns}>
          <Button className="shadowBtn mr1">批量操作设备</Button>
          <Button className="shadowBtn mr1">打开配置页面</Button>
          <Input className="searchInput mr1" placeholder="输入教室号" />
          <Button className="shadowBtn mr1">搜索</Button>
          <Button className="shadowBtn mr1">重置</Button>
          <Tooltip placement="rightTop" title={getTooltips} autoAdjustOverflow color="#236FB0">
            <QuestionCircleOutlined className={styles.ask} />
          </Tooltip>
        </div>
        <article className={styles.position}>
          <span className="mr1">清水河校区/品学楼</span>
          <span className="mr1">上课：1/61</span>
          <span className="mr1">故障：1/61</span>
        </article>
      </section>
      <section className={styles.center}>
        {roomData.length ? (
          roomData.map((item, index) => (
            <div className={styles.groupWrapper} key={'groupId' + item.groupId}>
              <h6>{item.group}</h6>
              <div className={styles.rooms}>
                {item.classroomData.map((room, index) => (
                  <SingleRoom
                    {...singleProps}
                    key={room.id}
                    {...room}
                    moduleStatus={item.moduleStatus}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <Empty />
        )}
      </section>
      <section className={styles.bottom}>
        {buttons.length ? (
          <>
            <section className={styles.bt}>
              <div>
                <h3>品学楼A104</h3>
                <h3>下课中</h3>
              </div>
              <h3>高级控制>></h3>
            </section>
            <ul className={styles.controlBtns}>
              {buttons.map(item => (
                <li key={item}>
                  <span>上下课</span>
                  <div
                    className={styles.gridButtons}
                    // style={{
                    //   gridTemplateColumns: `repeat(${Math.ceil(item.keyData.length / 2)},1fr)`,
                    // }}
                  >
                    {[1, 2].map(j => (
                      <Button className="pad shadowBtn">意见上课</Button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </section>
    </div>
  );
};
export default ClassRooms;
