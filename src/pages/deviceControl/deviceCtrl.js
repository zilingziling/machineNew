import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, message, Spin, Alert, Modal, Tree } from 'antd';
import './index.less';
import SingleRoom from './components/singleRoom';
import { getStatus } from '../../service/deviceCtrlReq';
const { DirectoryTree } = Tree;
// import {
//   handleProjector,
//   stateCtrLight,
//   uint8Buff2Str,
// } from '../component/function/formatDateReturn';
// import socket from '../../stores/socket';
const { confirm } = Modal;
const DeviceCtrl = () => {
  const getInitSelect = () => {
    if (window.localStorage.getItem('CtrClassrommid')) {
      return window.localStorage.getItem('CtrClassrommid').split(':')[0];
    } else return '';
  };
  const [schoolId, setSchool] = useState(
    window.localStorage.getItem('deviceSelected')
      ? window.localStorage.getItem('deviceSelected').split(':')[0]
      : '',
  );
  const [roomControls, setControl] = useState([]);
  const [selectRoomName, setName] = useState('');
  const [classStatus, setClassStatus] = useState({});
  const [data, setData] = useState([]);
  const [selectedRoom, setSR] = useState(false);
  const [batch, setBatch] = useState(false);
  const [allBtn, setAllBtn] = useState([]);
  const [treePosition, setTreePosition] = useState('');
  const [selectGroup, setGroupId] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  const [socket, setSocket] = useState({});
  // room单选
  const [selectId, setSelectId] = useState(getInitSelect());
  const [loadingStatus, setLoading] = useState(false);
  // 搜索
  const [searchValue, setSearch] = useState('');
  // 上课和故障数据
  const [breakSize, setBreakSize] = useState('');
  const [classroomTypeSize, setClassroomTypeSize] = useState('');
  // 检测到已删除数据
  const [deleteClassroom, setDeleteRoom] = useState('');
  const [deleteClassroomSize, setDeleteSize] = useState('');
  // 加载中
  const [spin, setSpin] = useState(false);
  // init
  const init = (reset = false) => {
    if (!schoolId) return;
    setSpin(true);
    getStatus({ id: schoolId, keyword: reset ? '' : searchValue }).then(r => {
      if (r.data) {
        setSpin(false);
        if (r.data.length > 0) {
          setBreakSize(r.data[0].breakSize);
          setClassroomTypeSize(r.data[0].classroomTypeSize);
          setDeleteRoom(r.data[0].deleteClassroom);
          setDeleteSize(r.data[0].deleteClassroomSize);
        } else {
          setSearch('');
        }
        toOringin(r.data);

        // setData(r.data);
      }
    });
  };
  useEffect(() => {
    init();
  }, [init]);
  useEffect(() => {
    let array = [];
    data &&
      data.map(i => {
        i.classroomData.map(room =>
          room.baseEquipment.map(btn => {
            if (array.length === 0) {
              array.push(btn);
            } else if (array.findIndex(m => btn.equitCode === m.equitCode) === -1) {
              array.push(btn);
            }
          }),
        );
      });
    setAllBtn(array);
    let newArr = [];
    data.map(inner => {
      inner.classroomData.map(room => newArr.push(room));
    });
    let ary1 = newArr.filter(item => item.clickStatus === false);
    let ary2 = newArr.filter(item => item.clickStatus === true);
    if (ary1.length > 0) {
      setSelectAll(false);
    } else if (ary2.length === newArr.length && newArr.length !== 0) {
      setSelectAll(true);
    }
    if (selectId && data) {
      data.map(room => {
        room.classroomData.map(inner => {
          if (inner.classroomId === selectId) {
            setClassStatus({
              type: inner.classroomType,
              loading: inner.loading,
            });
          }
        });
      });
    }
  }, [data, selectId]);

  const docClick = () => {
    let newData =
      data &&
      data.map(room => {
        room.classroomData.map(inner => {
          if (inner.classroomId === selectId) {
            inner.clickStatus = false;
          }
        });
        return room;
      });
    setData(newData);
    setSelectId('');
    setControl([]);
    // setAllBtn([])
    setClassStatus({});
    setName('');
  };
  useEffect(() => {
    if (selectId) {
      document.addEventListener('click', docClick);
      return () => {
        document.removeEventListener('click', docClick);
      };
    }
  }, [docClick, selectId]);
  const onSelectSchool = (key, e) => {
    let id;
    if (e.selectedNodes.length > 0) {
      let obj = e.selectedNodes[0].props.dataref.row;
      id = obj.id;
      //   next
      setTreePosition(e.node.props.title);
      if (e.node.props.dataref.key.includes('school_academic_building')) {
        setSpin(true);
        setSchool(id);
        setControl([]);
        getStatus({ id, keyword: searchValue }).then(r => {
          if (r.data) {
            setSpin(false);
            toOringin(r.data);
            // setData(r.data);
          }
        });
      } else {
        setSchool('');
        setData([]);
      }
    }
  };
  // socket
  // useEffect(() => {
  //   _infomsg();
  // }, [socket, data]);
  const roomProps = {
    roomControls,
    setControl,
    setName,
    setClassStatus,
    setSR,
    selectId,
    setSelectId,
    batch,
    selectGroup,
    setGroupId,
    data,
    setData,
  };
  const onClickBatch = () => {
    if (schoolId) {
      setBatch(!batch);
    } else {
      message.info('请先选择教室！');
    }
  };
  const toOringin = oriData => {
    let ary = [];
    if (oriData) {
      ary = oriData;
    } else ary = data;
    let newData = ary.map(inner => {
      inner.classroomData.map(room => {
        room.clickStatus = false;
        // room.loading=false
        return room;
      });
      return inner;
    });
    setData(newData);
  };
  useEffect(() => {
    if (!batch) {
      toOringin();
      setControl([]);
      setName('');
      setClassStatus({});
      setSelectId('');
    }
  }, [batch, toOringin]);

  useEffect(() => {
    if (selectId && data) {
      let newData = data.map(inner => {
        inner.classroomData.map(room => {
          room.clickStatus = room.classroomId === selectId;
          return room;
        });
        return inner;
      });
      setData(newData);
    }
  }, [data, selectId]);
  const toConfig = () => {
    window._guider.History.history.push({
      pathname: '/deviceAdd',
    });
  };
  const onSelectAll = () => {
    setSelectAll(!selectAll);
    if (data) {
      let newData = data.map(inner => {
        inner.classroomData.map(room => {
          room.clickStatus = !selectAll;
          return room;
        });
        return inner;
      });
      setData(newData);
    }
  };
  //接受websock消息
  const _infomsg = () => {
    // window.ws.onmessage = evt => {
    //   let baseMsg = proto.cn.yjtianxia.im.protocol2.BaseMsg.deserializeBinary(evt.data);
    //   let objdata;
    //   try {
    //     objdata = uint8Buff2Str(baseMsg.getData());
    //     console.log('socket数据', JSON.parse(objdata));
    //     objdata = JSON.parse(objdata);
    //     setSocket(objdata);
    //     console.log(data);
    //     if (data.length > 0) {
    //       console.log(1);
    //       let ary = data;
    //       console.log(objdata.classroomData.classroomId);
    //       ary = ary.map(room => {
    //         room.classroomData.map(classroom => {
    //           if (classroom.classroomId === objdata.classroomData.classroomId) {
    //             if (objdata.classroomData.masterEquipment.length) {
    //               classroom.masterEquipment.map(i => {
    //                 objdata.classroomData.masterEquipment.map(e => {
    //                   if (i.equipCode === e.equipCode) {
    //                     i.equipType = e.equipType;
    //                   }
    //                 });
    //               });
    //             }
    //             classroom.classroomType = objdata.classroomData.classroomType;
    //             classroom.loading = objdata.classroomData.loading;
    //           }
    //           return classroom;
    //         });
    //         return room;
    //       });
    //       setData(ary);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
  };
  const [waringShow, setWarningShow] = useState(true);
  const buttonProps = {
    selectId,
    selectRoomName,
    classStatus,
    batch,
    setLoading,
    setBatch,
    schoolId,
    data,
    setData,
    socket,
  };
  const checkWarning = () => {
    confirm({
      title: '提示',
      content: `${deleteClassroom}已不存在，如需从此页面中去除显示，请到“区域管理”中将其删除。`,
      okText: '区域管理',
      cancelText: '已了解',
      onOk() {
        window._guider.History.history.push({
          pathname: 'region',
        });
      },
      onCancel() {},
    });
  };
  const getWarning = () => {
    return (
      <p>
        {`系统检测到有${deleteClassroomSize}间教室已不存在。`}
        <a onClick={checkWarning} style={{ marginRight: '10px' }} href={null}>
          查看
        </a>
        <a onClick={() => setWarningShow(false)} href={null}>
          忽略
        </a>
      </p>
    );
  };
  return (
    <div className="treeWrapper">
      {/*树菜单*/}
      <DirectoryTree
        multiple
        showLine
        defaultExpandAll
        onSelect={onSelectSchool}
        onExpand={onExpand}
        treeData={treeData}
        className="normalTree"
        showIcon={false}
      />
      <div className="normalTable mt0">
        <Spin wrapperClassName="spinWrapper" tip="加载中..." size="large" spinning={spin}>
          {schoolId ? (
            data.length > 0 ? (
              <div className="controlDisc">
                <div className="batchOpe">
                  <div className="topButtons">
                    <Button type="primary" onClick={onClickBatch}>
                      {batch ? '取消批量操作' : '批量操作设备'}
                    </Button>
                    <Button type="primary" disabled={batch} onClick={toConfig}>
                      打开配置页面
                    </Button>
                    <Input
                      value={searchValue}
                      onChange={e => setSearch(e.target.value)}
                      style={{ width: '8rem', margin: '0 .5rem 0 1rem' }}
                      placeholder="输入教室号"
                      onPressEnter={() => init()}
                    />
                    <Button type="primary" disabled={!searchValue} onClick={() => init()}>
                      搜索
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        setSearch('');
                        init(true);
                      }}
                    >
                      重置
                    </Button>
                    {Number(deleteClassroomSize) > 0 && waringShow ? (
                      <Alert message={getWarning()} type="warning" showIcon />
                    ) : null}
                  </div>
                  <p>
                    <span>
                      {data ? (data.length && schoolId ? data[0].schoolData : treePosition) : ''}
                    </span>
                    <span>上课：{classroomTypeSize}</span>
                    <span>故障：{breakSize}</span>
                  </p>
                </div>
                {/*教室列表*/}
                <div className="rooms">
                  {batch && (
                    <div className="selectA" onClick={onSelectAll}>
                      <img
                        src={
                          selectAll
                            ? require('../../assets/deviceControl/checked.png')
                            : require('../../assets/deviceControl/check.png')
                        }
                        alt="check"
                      />
                      <span>选择全部</span>
                    </div>
                  )}
                  {data &&
                    data.map((item, index) => (
                      <Rooms {...roomProps} innerData={item} key={`${index}group`} />
                    ))}
                </div>
                <div className="batchControl">
                  {selectId || batch ? (
                    <Buttons {...buttonProps} btns={batch ? allBtn : roomControls} />
                  ) : (
                    <div className="deviceNotice">
                      <img src={require('../../assets/deviceControl/notice.png')} alt="notice" />
                      <span>请在上面选择需要控制的教室</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="selectNotice">
                <img src={require('../../assets/deviceControl/notice.png')} alt="notice" />
                <h2>暂无教室信息！</h2>
              </div>
            )
          ) : (
            <div className="selectNotice">
              <img src={require('../../assets/deviceControl/notice.png')} alt="notice" />
              <h2>请选择教学楼！</h2>
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

const Buttons = ({
  batch,
  btns,
  selectRoomName,
  classStatus,
  data,
  setBatch,
  setLoading,
  setData,
  selectId,
  socket,
}) => {
  // 设备控制
  const [selectedRooms, setSelectedRooms] = useState(0);
  useEffect(() => {
    let clickedArr = [];
    data.map(room => {
      let a = room.classroomData.filter(inner => inner.clickStatus === true);
      clickedArr = clickedArr.concat(a);
    });
    setSelectedRooms(clickedArr.length);
  }, [data]);
  const handleControl = (event, ids, equitCode) => {
    event.nativeEvent.stopImmediatePropagation();
    setLoading(true);
    let idAry = [];
    let clickedArr = [];
    let propAry = [];
    if (batch) {
      data &&
        data.map(room => {
          let a = room.classroomData.filter(inner => inner.clickStatus === true);
          clickedArr = clickedArr.concat(a);
        });
      clickedArr.map(room => {
        let a = room.baseEquipment.filter(equip => equip.equitCode === equitCode);
        propAry = propAry.concat(a);
      });
      propAry.map(equip => idAry.push(equip.equipclassroomId));
    } else {
      idAry.push(ids.equipclassroomId);
    }
    if (idAry.length > 0) {
      // control({ ...ids, equipclassroomId: idAry }).then(r => {
      //   if (r.code === 200) {
      //     window._guider.Utils.alert({
      //       message: r.msg,
      //       type: 'success',
      //     });
      //     if (batch) {
      //       let newData =
      //         data &&
      //         data.map(room => {
      //           room.classroomData.map(inner => {
      //             if (inner.clickStatus === true) {
      //               inner.loading = true;
      //             }
      //           });
      //           return room;
      //         });
      //       setData(newData);
      //       setBatch(false);
      //     } else {
      //       let newData =
      //         data &&
      //         data.map(room => {
      //           room.classroomData.map(inner => {
      //             if (inner.classroomId === selectId) {
      //               inner.loading = true;
      //             }
      //           });
      //           return room;
      //         });
      //       setData(newData);
      //     }
      //     setTimeout(() => {
      //       if (!Object.keys(socket).length) {
      //         // 超时未响应
      //         let newData =
      //           data &&
      //           data.map(room => {
      //             room.classroomData.map(inner => {
      //               if (inner.loading === true) {
      //                 inner.loading = false;
      //               }
      //             });
      //             return room;
      //           });
      //         setData(newData);
      //       }
      //     }, 110000);
      //     setTimeout(() => {
      //       let newData =
      //         data &&
      //         data.map(room => {
      //           room.classroomData.map(inner => {
      //             if (inner.loading === true) {
      //               inner.loading = false;
      //             }
      //           });
      //           return room;
      //         });
      //       setData(newData);
      //     }, 140000);
      //   }
      // });
    } else message.error('你还未选择要控制的教室！');
  };
  return (
    <>
      <h6>
        {batch ? '' : selectRoomName}
        <span className="classStatus">
          {batch
            ? `已选教室：${selectedRooms}`
            : classStatus.type === 'on'
            ? '上课'
            : classStatus.type === 'off'
            ? '下课'
            : classStatus.type === 'busyOn'
            ? '上课中'
            : classStatus.type === 'busyOff'
            ? '下课中'
            : ''}
        </span>
      </h6>
      <ul className="controlBtns">
        {btns.map(btnGroup => (
          <li key={btnGroup.equipclassroomId}>
            <span>{btnGroup.equipName}</span>
            <div
              className="gridButtons"
              style={{
                gridTemplateColumns: `repeat(${Math.ceil(btnGroup.keyData.length / 2)},1fr)`,
              }}
            >
              {btnGroup.keyData.map(singleBtn => (
                <Button
                  onClick={event =>
                    handleControl(
                      event,
                      {
                        equipclassroomId: btnGroup.equipclassroomId,
                        keyId: singleBtn.keyId,
                      },
                      btnGroup.equitCode,
                    )
                  }
                  key={singleBtn.keyId}
                  type="primary"
                  className="pad"
                >
                  {singleBtn.keyName}
                </Button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
// 每条数据
const Rooms = ({
  innerData,
  roomControls,
  setControl,
  setName,
  setClassStatus,
  setSR,
  selectId,
  setSelectId,
  batch,
  selectGroup,
  setGroupId,
  data,
  setData,
}) => {
  const [groupCheck, setGroup] = useState(false);

  const onClickCircle = () => {
    setGroupId(innerData.groupId);
    setGroup(!groupCheck);
    let newData =
      data &&
      data.map(room => {
        if (room.groupId === innerData.groupId) {
          room.classroomData.map(inner => {
            inner.clickStatus = !groupCheck;
          });
          return room;
        } else return room;
      });
    setData(newData);
  };
  const singleProps = {
    roomControls,
    setControl,
    setName,
    setClassStatus,
    setSR,
    setSelectId,
    selectId,
    setGroup,
    batch,
    data,
    setData,
  };
  useEffect(() => {
    let ary = innerData.classroomData.filter(i => i.clickStatus === true);
    if (ary.length === innerData.classroomData.length) {
      setGroup(true);
    } else setGroup(false);
  }, [data, innerData.classroomData]);
  return (
    <div className="roomsRow">
      {batch && (
        <img
          onClick={onClickCircle}
          src={
            groupCheck
              ? require('../../assets/deviceControl/checked.png')
              : require('../../assets/deviceControl/check.png')
          }
          alt="check"
        />
      )}
      {/*<h2>{innerData.group}</h2>*/}
      <div className="roomsGroup">
        {innerData.classroomData.map((room, index) => (
          <SingleRoom {...singleProps} roomInfo={room} key={room.classroomId} />
        ))}
      </div>
    </div>
  );
};

export default DeviceCtrl;
const treeData = [
  {
    title: 'parent 0',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
      { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
      { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
    ],
  },
];
const onSelect = (keys, event) => {
  console.log('Trigger Select', keys, event);
};

const onExpand = () => {
  console.log('Trigger Expand');
};
