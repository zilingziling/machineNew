import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { RouterPmi } from '../component/function/routerPmi';
import './index.scss';
import { sceneOpe } from '../../api/device';
import { one_key_class_begin, one_key_class_over } from '../../api/ctrl';
const confirm = Modal.confirm;

const QuickOpe = ({ scene, position, sele, onekey, status, setStatus }) => {
  //返回上级页面
  const _info = RouterPmi();
  const [modalV, setV] = useState(false);
  const [count, setCount] = useState('');

  useEffect(() => {
    if (onekey.length > 0) {
      setStatus(!onekey.filter(i => i.highlight === '1')[0].key_name.includes('上课'));
    }
  }, [onekey, setStatus]);
  const _returnPage = () => {
    window._guider.History.history.push({
      pathname: '/deviceAdd',
    });
  };
  const handleProgress = scene => {
    setV(true);
    setCount(scene.sum);
    let a = Number(scene.sum);
    sceneOpe({ sceneId: scene.scene_no, classId: sele }).then(r => {
      if (r.code === 200) {
        window._guider.Utils.alert({
          message: r.msg,
          type: 'success',
        });
      } else
        window._guider.Utils.alert({
          message: r.msg,
          type: 'error',
        });
    });
    let Time = setInterval(() => {
      setCount(a--);
      if (a <= 0) {
        setCount(0);
        setV(false);
        clearInterval(Time);
      }
    }, 1000);
  };
  const progressBody = {
    padding: ' 3rem',
    color: '#ffffff',
  };
  // 上下课
  const handleOneKey = () => {
    confirm({
      className: 'modles',
      centered: true,
      title: status
        ? '下课会打开本教室里相关的设备，确认关闭？'
        : '上课会打开本教室里相关的设备，确认开启？',
      onOk: async () => {
        if (sele) {
          let res;
          if (status) {
            res = await one_key_class_over(sele);
          } else {
            res = await one_key_class_begin(sele);
          }
          if (res.code === 200) {
            window._guider.Utils.alert({
              message: res.msg,
              type: 'success',
            });
          } else {
            window._guider.Utils.alert({
              message: res.msg,
              type: 'error',
            });
          }
        } else {
          window._guider.Utils.alert({
            message: '请选择教室',
            type: 'error',
          });
        }
      },
      onCancel: () => {},
    });
  };
  return (
    <div className="status">
      <Modal
        centered
        bodyStyle={progressBody}
        footer={null}
        closable={false}
        visible={modalV}
        title="设备执行中，请稍后..."
      >
        <h1 style={{ color: '#ffffff', textAlign: 'center' }}>
          你还需等待 <span style={{ color: '#00ffff' }}>{count}</span> s
        </h1>
      </Modal>
      <span className="border row1"></span>
      <span className="border row2"></span>
      <span className="border col1"></span>
      <span className="border col2"></span>
      <div className="top">
        <p>
          <span>当前状态：</span>
          <span className="b">{status ? '上课中' : '下课中'}</span>
          <span>（{position}）</span>
        </p>
        <Button className="skip" disabled={!_info.includes('return_config')} onClick={_returnPage}>
          去配置页
        </Button>
      </div>
      <div className="bottom">
        <Button size="large" className="begin" onClick={handleOneKey}>
          {status ? '一键下课' : '一键上课'}
        </Button>
        <img src={require('../../assets/deviceIcons/divide.png')} alt="divide" />
        <div className="buttonGroup">
          {scene &&
            scene.map(scene => (
              <Button
                onClick={() => handleProgress(scene, 'scene')}
                key={scene.id}
                className="scene"
              >
                {scene.scene_name}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default QuickOpe;
