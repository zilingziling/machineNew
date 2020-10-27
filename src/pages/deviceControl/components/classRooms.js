import React, { useEffect, useState } from 'react';
import styles from '../index.less';
import { Button, Input, Tooltip, Empty, notification } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getTooltips, initClassroomData } from '@/pages/deviceControl/components/someFunc';
import SingleRoom from '@/pages/deviceControl/components/singleRoom';
import { getUuid, uint8Buff2Str } from '@/utils/func';
import Group from '@/pages/deviceControl/components/group';
import { control, getClassrooms } from '@/service/deviceControl';
import { history } from '@/.umi/core/history';
import { webSocket } from '@/utils/websocket';
const ClassRooms = ({
  schoolId,
  buildingName,
  roomData,
  setRoomData,
  position,
  setPosition,
  buttons,
  setButtons,
}) => {
  const [selectClassroomInfo, setSelectClassroomInfo] = useState({});
  const [batch, setBatch] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [allBtn, setAllBtn] = useState([]);
  const onSearch = () => {
    if (!schoolId) {
      notification.error({
        message: '请先选择教室！',
      });
      return;
    }
    if (!keyword) {
      return;
    }
    getClassrooms({ schoolId, keyword }).then(r => {
      if (r.code === 0) {
        setRoomData(initClassroomData(r.data.resultList));
        setPosition(r.data.position);
      }
    });
  };
  const onReset = () => {
    setKeyword('');
    getClassrooms({ schoolId, keyword: '' }).then(r => {
      if (r.code === 0) {
        setRoomData(initClassroomData(r.data.resultList));
        setPosition(r.data.position);
      }
    });
  };
  const singleProps = {
    roomData,
    setRoomData,
    setButtons,
    buildingName,
    setSelectClassroomInfo,
    batch,
  };
  const onClickBatch = () => {
    setRoomData(initClassroomData(roomData).slice());
    setIsSelectAll(false);
    if (schoolId) {
      setBatch(!batch);
    } else {
      notification.error({
        message: '请先选择教室！',
      });
    }
    if (!batch) {
      setSelectClassroomInfo({});
      setButtons([]);
    }
  };
  // 全选
  const onclickSelectAll = () => {
    let a = roomData;
    setIsSelectAll(!isSelectAll);
    a.forEach(i => {
      i.classroomData.forEach(j => {
        j.checkStatus = true;
      });
    });
    let data = isSelectAll ? initClassroomData(roomData) : a;
    setRoomData(data.slice());
  };
  // roomData改变时
  useEffect(() => {
    let arr = [];
    let btnArr = [];
    roomData.forEach(item => {
      item.classroomData.forEach(j => arr.push(j));
    });
    arr.forEach(i => {
      i.baseEquipment.forEach(btn => {
        if (btnArr.length === 0) {
          btnArr.push(btn);
        } else if (btnArr.findIndex(m => btn.code === m.code) === -1) {
          btnArr.push(btn);
        }
      });
    });
    setAllBtn(btnArr);
    if (batch) {
      const a = arr.find(item => !item.checkStatus);
      if (a) {
        setIsSelectAll(false);
      } else setIsSelectAll(true);
    }
  }, [roomData]);
  const groupProps = {
    singleProps,
    batch,
  };
  const docClick = () => {
    let newData = roomData;
    if (!newData.length) {
      return;
    }
    newData.forEach(item => {
      item.classroomData.forEach(inner => {
        if (inner.id === selectClassroomInfo.classroomId) {
          inner.checkStatus = false;
        }
      });
    });
    setRoomData(newData.slice());
    setButtons([]);
    setSelectClassroomInfo({});
  };
  // 取消选择
  useEffect(() => {
    if (selectClassroomInfo) {
      document.addEventListener('click', docClick);
      return () => {
        document.removeEventListener('click', docClick);
      };
    }
  }, [selectClassroomInfo]);
  // 控制
  const onclickControlBtn = controlCommandId => {
    let classroomId = [];
    roomData.forEach(item => {
      item.classroomData.forEach(j => {
        if (j.checkStatus) {
          classroomId.push(j.id);
        }
      });
    });
    control({ controlCommandId, classroomId }).then(r => {
      if (r.code === 0) {
        notification.success({
          message: r.msg,
        });
      }
    });
  };
  const toConfig = () => {
    history.push({
      pathname: '/more/deviceConfig',
    });
  };
  const renderButtons = batch ? allBtn : buttons;
  // websocket
  const getWebsocketMsg = () => {
    try {
      window.ws.onmessage = evt => {
        let baseMsg = proto.cn.yjtianxia.im.protocol2.BaseMsg.deserializeBinary(evt.data);
        let objdata;
        try {
          objdata = uint8Buff2Str(baseMsg.getData());
          objdata = JSON.parse(objdata);
          console.log('socket数据', objdata);
          // if (data.length > 0) {
          //   console.log(1);
          //   let ary = data;
          //   console.log(objdata.classroomData.classroomId);
          //   ary = ary.map(room => {
          //     room.classroomData.map(classroom => {
          //       if (classroom.classroomId === objdata.classroomData.classroomId) {
          //         if (objdata.classroomData.masterEquipment.length) {
          //           classroom.masterEquipment.map(i => {
          //             objdata.classroomData.masterEquipment.map(e => {
          //               if (i.equipCode === e.equipCode) {
          //                 i.equipType = e.equipType;
          //               }
          //             });
          //           });
          //         }
          //         classroom.classroomType = objdata.classroomData.classroomType;
          //         classroom.loading = objdata.classroomData.loading;
          //       }
          //       return classroom;
          //     });
          //     return room;
          //   });
          //   setData(ary);
          // }
        } catch (error) {
          console.log(error);
        }
      };
    } catch (e) {
      console.log('deviceControlWsErr', e);
    }
  };
  useEffect(() => {
    getWebsocketMsg();
  }, [roomData]);
  const onClickScene = () => {
    history.push({
      pathname: '/scene',
    });
  };
  return (
    <div className={styles.deviceControlWrapper}>
      <section className={styles.top} onClick={e => e.nativeEvent.stopImmediatePropagation()}>
        <div className={styles.btns}>
          <Button className="shadowBtn mr1" onClick={onClickBatch}>
            {batch ? '取消批量操作' : '批量操作设备'}
          </Button>
          <Button className="shadowBtn mr1" disabled={batch} onClick={toConfig}>
            打开配置页面
          </Button>
          <Input
            className="searchInput mr1"
            onPressEnter={onSearch}
            placeholder="输入教室号"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <Button className="shadowBtn mr1" onClick={onSearch}>
            搜索
          </Button>
          <Button className="shadowBtn mr1" onClick={onReset}>
            重置
          </Button>
          <Button className="shadowBtn mr1" onClick={onClickScene}>
            情景编辑
          </Button>
          <Tooltip placement="rightTop" title={getTooltips} autoAdjustOverflow color="#236FB0">
            <QuestionCircleOutlined className={styles.ask} />
          </Tooltip>
        </div>
        <article className={styles.position}>
          <span className="mr1">{position}</span>
        </article>
      </section>
      <section className={styles.center}>
        {batch && (
          <div className={styles.selectAll} onClick={onclickSelectAll}>
            <img
              src={
                isSelectAll
                  ? require('../../../assets/deviceControl/checked.png')
                  : require('../../../assets/deviceControl/check.png')
              }
              alt="check"
            />
            <span>选择全部</span>
          </div>
        )}
        {roomData.length ? (
          roomData.map((item, index) => (
            <Group {...groupProps} item={item} key={'groupId' + item.groupId} />
          ))
        ) : (
          <Empty />
        )}
      </section>
      <section className={styles.bottom} onClick={e => e.nativeEvent.stopImmediatePropagation()}>
        {renderButtons.length ? (
          <>
            <section className={styles.bt}>
              <div>
                <h3>{selectClassroomInfo.name}</h3>
                <h3>{selectClassroomInfo.classStatus}</h3>
              </div>
              <h3>高级控制>></h3>
            </section>
            <ul className={styles.controlBtns}>
              {renderButtons.map((item, index) => (
                <li key={getUuid()}>
                  <span>{item.type}</span>
                  <div
                    className={styles.gridButtons}
                    style={{
                      gridTemplateColumns: `repeat(${Math.ceil(item.keyData.length / 2)},1fr)`,
                    }}
                  >
                    {item.keyData.map((j, index) => (
                      <Button
                        onClick={() => onclickControlBtn(j.controlCommandId)}
                        key={getUuid()}
                        className="pad shadowBtn"
                      >
                        {j.key}
                      </Button>
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
