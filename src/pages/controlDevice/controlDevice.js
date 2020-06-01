import React, { useEffect, useReducer, useState } from 'react';
import { Row, Col, Slider, Button } from 'antd';
import './index.scss';
import Bar from '../component/Bar/bar';
import VideoDistract from './components/video';
import AirStatus from './components/air';
import EnvStatus from './components/env/env';
import QuickOpe from './quickOpe';
import ControlBlock from './components/controlBlock/controlBlock';
import { getCaption, getUuid } from '../../utils/handleNumbers';
import { get_camera, get_equips } from '../../api/ctrl';
import useStores from '../../utils/useStore';

const ControlDevice = props => {
  // 控制展开收缩的ID
  const store = useStores('Socke');
  const [id, setId] = useState(-1);
  // 视频数据
  const [video, setVideo] = useState({
    teacher: [],
    students: [],
    desktop: [],
  });
  const [status, setStatus] = useState(false);
  // 选中的教室
  const [sele, setSele] = useState('');
  const [air, setAir] = useState({});
  const [scene, setScene] = useState([]);
  const [env, setEnv] = useState({});
  const [devices, setDevice] = useState({});
  const [classRoomInfo, setClassInfo] = useState([]);
  const [onekey, setOneKey] = useState([]);
  const itemProps = {
    id,
    setId,
    sele,
  };
  const quickProps = {
    sele,
    scene,
    position: classRoomInfo.length > 0 ? classRoomInfo[0].value : '',
    onekey,
    status,
    setStatus,
  };
  function myFlash(pP) {
    if (navigator.appName.indexOf('Microsoft') !== -1) {
      return window[pP];
    } else {
      return document[pP];
    }
  }
  // 接受websock消息
  const _infomsg = () => {
    window.ws.onmessage = evt => {
      try {
        let msg_id = getCaption(window.localStorage.getItem('CtrClassrommid'), 0); //获取当前的classroomID来判断提示
        let msg = new window.proto.com.yj.itgm.protocol.BaseMsg.deserializeBinary(evt.data);
        let dataMsg = new window.proto.com.yj.itgm.protocol.BaseDataMsg.deserializeBinary(
          msg.getData(),
        );
        if (dataMsg.getCommand() === 2000) {
          //发送设备响应的返回
          let promptMsg = new window.proto.com.yj.itgm.protocol.EquipResponse.deserializeBinary(
            dataMsg.getData(),
          );
          if (msg_id == promptMsg.toObject().classroomId) {
            window._guider.Utils.alert({
              message: promptMsg.toObject().msg,
              type: 'success',
            });
          }
        } else if (dataMsg.getCommand() === 2001) {
          //设备状态上报返回信息
          let obj = new window.proto.com.yj.itgm.protocol.EquipStatusReport.deserializeBinary(
            dataMsg.getData(),
          );
          if (obj.toObject().detailList.length > 0) {
            //处理设备状态返回，这个页面状态主要是这这里面判断
            let res = obj.toObject().detailList;
            if (res.data.classRoomInfo) setClassInfo(res.data.classRoomInfo);
            if (res.data.environment) setEnv(res.data.environment);
            if (res.data.onekey) setOneKey(res.data.onekey);
            if (res.data.scene) setScene(res.data.scene);
            // if(res.data.function)setDevice(res.data.function?res.data.function:[])
          }
        } else if (dataMsg.getCommand() === 2002) {
          //设备跳转控制页面
          let obj = new window.proto.com.yj.itgm.protocol.IntercomCall.deserializeBinary(
            dataMsg.getData(),
          );
          let detailList = obj.toObject().detailList;
          if (window.location.href.includes('deviceControl')) {
            console.log(msg_id, detailList[detailList.length - 1].id);
            if (detailList[detailList.length - 1].id != msg_id) {
              store.Socke.jumpCtr(detailList, 1);
            }
          } else {
            store.Socke.jumpCtr(detailList);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
  };
  const info = () => {
    allInfo(window.localStorage.getItem('classroomid')); //data
    setSele(window.localStorage.getItem('classroomid'));
    getVideoLive(window.localStorage.getItem('classroomid')); //视频地址
  };
  useEffect(() => {
    if (window.localStorage.getItem('userName') !== null) {
      _infomsg();
    }
    info(); //data
    window.addEventListener('online', () => {
      _infomsg();
    });
  }, [_infomsg, info]);
  const Bars = e => {
    let val = e.split(':');
    if (val[1] === 'classroom') {
      if (typeof e !== 'undefined') {
        getVideoLive(val[0]);
        setSele(val[0]);
        allInfo(val[0]);
      } else {
        setCondition([]);
        setPC([]);
      }
    }
  };

  //   所有数据处理
  const allInfo = async id => {
    try {
      if (id) {
        let res = await get_equips(id);
        if (res.code === 200) {
          setClassInfo(res.data.classRoomInfo ? res.data.classRoomInfo : {});
          setScene(res.data.scene ? res.data.scene : []);
          setAir(
            res.data.function
              ? Object.keys(res.data.function).length > 0
                ? Object.values(res.data.function).filter(i => i.ui_type === 'aircondition')
                : {}
              : {},
          );
          setEnv(res.data.environment ? res.data.environment : {});
          setDevice(res.data.function ? res.data.function : []);
          setOneKey(res.data.onekey ? res.data.onekey : []);
        }
      }
    } catch (e) {}
  };
  // 请求视频
  const getVideoLive = async id => {
    let res = await get_camera(id);
    if (!res.data) return;
    if (JSON.stringify(res.data) !== '{}') {
      let camera = res.data.camera ? res.data.camera : [];
      let pc = res.data.pc ? res.data.pc : [];
      if (camera.length > 0 && pc.length > 0) {
        setVideo({
          teacher: typeof camera[1] !== 'undefined' ? camera[1] : [],
          students: typeof camera[2] !== 'undefined' ? camera[2] : [],
          desktop: typeof pc[0] !== 'undefined' ? pc[0] : [],
        });
      }
      refreshPlay(); //自动播放
    } else {
      setVideo({
        teacher: [],
        students: [],
        desktop: [],
      });
    }
  };
  // 低清视频
  const refreshPlay = () => {
    try {
      let videoLive = video;
      let arrayUlr = [];
      arrayUlr.push(videoLive.teacher.n1url, videoLive.students.n1url, videoLive.desktop);
      let url = arrayUlr.filter(d => d); //去除数组中的null
      myFlash('XKFlashPlayer').refreshDisplay(JSON.stringify(url));
    } catch (error) {
      console.log(error);
    }
  };
  const FullScreen = () => {
    try {
      let videoLive = video;
      let arrayUlr = [];
      arrayUlr.push(videoLive.teacher.n2url, videoLive.students.n2url, videoLive.desktop);
      myFlash('XKFlashPlayer').refreshDisplay(JSON.stringify(arrayUlr));
    } catch (error) {
      console.log(error);
    }
  };

  const videoProps = {
    refreshPlay,
    FullScreen,
  };
  const envProps = {
    classRoomInfo,
    env,
  };
  const airProps = {
    air,
    sele,
  };
  return (
    <div className="outerWrap">
      {/*<div className="unique">*/}
      {/*  <iframe title="myiframe" src="http://172.16.3.21:8099/" width="2000px" height="1000px"/>*/}
      {/*</div>*/}
      {/* 树菜单*/}
      <Bar Seleshcool={Bars} />
      {/*   右边区域*/}
      <div className="rightContent">
        {/* 右中*/}

        <div>
          <QuickOpe {...quickProps} />
          <div className="core">
            {Object.keys(devices).length > 0
              ? Object.values(devices)
                  .filter(i => i.ui_type !== 'aircondition')
                  .map((item, index) => (
                    <ControlBlock
                      {...itemProps}
                      index={index}
                      key={`${item.uuid}${index}`}
                      {...item}
                      item={item}
                    />
                  ))
              : null}
          </div>
        </div>
        {/*右右*/}
        <div>
          <VideoDistract {...videoProps} />
          {/*{Object.keys(air).length>0? <AirStatus {...airProps}/>:null}*/}
          <AirStatus {...airProps} />
          <EnvStatus {...envProps} />
        </div>
      </div>
    </div>
  );
};

export default ControlDevice;
