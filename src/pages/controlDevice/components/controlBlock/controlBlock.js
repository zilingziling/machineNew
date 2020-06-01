import React, { useState } from 'react';
import { Button } from 'antd';
import Title from '../common/tittle';
import Item from '../common/item';
import { Slider } from 'antd';
import down from '../../../../assets/deviceIcons/slidedown.png';
import volume from '../../../../assets/deviceIcons/音量.png';
import divide from '../../../../assets/deviceIcons/divide.png';
import silence from '../../../../assets/deviceIcons/silence.png';
import './controlBlock.scss';
import { debounce } from '../../../component/function/formatDateReturn';
import { controlReq, getUuid } from '../../../../utils/handleNumbers';

const ControlBlock = ({
  title,
  ui_type,
  equip_type,
  setId,
  id,
  index,
  parent,
  sub,
  item,
  sele,
}) => {
  const [float, setFloat] = useState('');
  const [percent, setPer] = useState('');
  const [borderTL, setBTL] = useState('');
  const [borderTR, setBTR] = useState(0);
  const [volumeValue, setValume] = useState(item.statusdata ? item.statusdata : '');
  const [isSilence, setSilence] = useState(item.equipstatus ? item.equipstatus === '静音' : false);
  const handleCollapse = () => {
    setFloat(index % 2 === 0 ? 'left' : 'right');
    setPer(index % 2 === 0 ? '48.8% 51.2%' : '51.2% 48.8%');
    setBTL(index % 2 === 0 ? 'none' : '1px solid #38E3FC');
    setBTR(index % 2 === 0 ? '1px solid #38E3FC' : 'none');
    if (id === equip_type) {
      setId(-1);
    } else {
      setId(equip_type);
    }
  };
  const restStyle = {
    float: float,
    gridTemplateColumns: percent,
    borderColor: '#38E3FC',
  };
  const bottomStyle = {
    borderColor: '#38E3FC',
    borderBottom: 'none',
    height: '8.5rem',
  };

  const handleClick = debounce(item => {
    let array = [];
    if (item.name === '全开' || item.name === '全关') {
      array = item.para;
    } else {
      array.push({
        equip_code: item.equip_code,
        key_id: item.key_id,
        equip_type_id: item.equip_type,
      });
    }
    controlReq(sele, array);
  });
  // 静音
  const _mute = item => {
    //keyId 静音是41 …… 不静音 是43
    setSilence(!isSilence);

    // if (typeof this.props.voice === "object") {
    //   let keyId;
    // if (!this.state.mrakVolume) {
    //   this.setState({
    //     mrakVolume: true
    //   });
    //   keyId = 43;
    // } else {
    //   this.setState({
    //     mrakVolume: false
    //   });
    //   keyId = 41;
    // }
    // let obj = this.props.voice;
    let param = [
      {
        equip_code: item.equipcode,
        key_id: isSilence ? 41 : 43,
        key_value: volumeValue,
        equip_type_id: item.equiptype,
      },
    ];
    controlReq(sele, param);
  };

  // 音量滑块
  const slideChange = volume => {
    setValume(volume);
    setSilence(false);
  };

  // 滑动以后
  const handleVoiceChange = async () => {
    if (typeof item.equipcode !== 'undefined') {
      let param = [
        {
          equip_code: item.equipcode,
          key_id: 43,
          key_value: volumeValue,
          equip_type_id: item.equiptype,
        },
      ];
      controlReq(sele, param);
    } else {
      window._guider.Utils.alert({
        message: '该教室没有功放',
        type: 'warning',
      });
    }
  };

  return (
    <div className="wholeBlock">
      <div className="blockWrap" style={id === equip_type ? bottomStyle : null}>
        <div className="titleRow">
          <Title title={title} />
          {ui_type === 'slide' ? null : (
            <div className="collapse" onClick={handleCollapse}>
              <span>
                {item.highLight}/{item.total}
              </span>
              <img
                alt="collapse"
                src={down}
                style={{ transform: id === equip_type ? 'rotate(180deg)' : '' }}
              />
            </div>
          )}
        </div>
        <div className="flexBox">
          {ui_type === 'slide' ? (
            <div className="slideType">
              <div className="imgWrap">
                <img alt="volume" onClick={() => _mute(item)} src={isSilence ? silence : volume} />
              </div>
              <Slider
                max={100}
                min={0}
                value={Number(volumeValue)}
                onChange={slideChange}
                onAfterChange={handleVoiceChange}
                className="sliderBar"
              />
              <span>{volumeValue}%</span>
            </div>
          ) : (
            parent &&
            parent.map((item, index) => (
              // src={require("../../../../assets/img" + item.key_img)}
              <Item
                handleClick={() => handleClick(item)}
                highLight={item.highLight || item.highlight}
                src={'http://172.16.3.207:8099/deviceapi/' + item.key_img}
                key={index}
                name={item.name || item.key_name}
              />
            ))
          )}
        </div>
      </div>
      {id === equip_type ? (
        <div className="rest" style={restStyle}>
          {sub && sub.length === 1 ? (
            <>
              <div className="left" style={{ borderTop: 0 > 1 ? 'none' : borderTL }}>
                <img src={divide} alt="restDivide" />
                <div className="leftInside">
                  <p>{sub[0].title}</p>
                  <div className="noPicBtns">
                    {sub[0].buttons.map((i, index) => (
                      <Button
                        onClick={() => handleClick(i)}
                        className={i.highLight === 1 || i.highlight === '1' ? 'active' : ''}
                        key={index}
                        style={{ fontSize: i.key_name.length > 4 ? '12px' : '' }}
                      >
                        {i.name || i.key_name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="right" style={{ borderTop: borderTR }} />
            </>
          ) : (
            sub &&
            sub.map((item, index) =>
              index % 2 === 0 ? (
                <>
                  <div className="left" style={{ borderTop: index > 1 ? 'none' : borderTL }}>
                    <img src={divide} alt="restDivide" />
                    <div className="leftInside">
                      <p>{item.title}</p>
                      <div className="noPicBtns">
                        {item.buttons.map((i, index) => (
                          <Button
                            onClick={() => handleClick(i)}
                            className={i.highLight === 1 || i.highlight === '1' ? 'active' : ''}
                            key={getUuid()}
                            style={{ fontSize: i.key_name.length > 4 ? '12px' : '' }}
                          >
                            {i.name || i.key_name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="right" style={{ borderTop: index > 1 ? 'none' : borderTR }}>
                  <div className="rightInside">
                    <p>{item.title}</p>
                    <div className="noPicBtns">
                      {item.buttons.map((i, index) => (
                        <Button
                          onClick={() => handleClick(i)}
                          className={i.highLight === 1 || i.highlight === '1' ? 'active' : ''}
                          key={getUuid()}
                          style={{ fontSize: i.key_name.length > 4 ? '12px' : '' }}
                        >
                          {i.name || i.key_name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            )
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ControlBlock;
