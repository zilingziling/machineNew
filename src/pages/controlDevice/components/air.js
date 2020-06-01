import React, { useEffect, useState } from 'react';
import { Button, Slider } from 'antd';
import img from '../../../assets/deviceIcons/aircoldnormal.png';
import Title from './common/tittle';
import Item from './common/item';
import { debounce } from '../../component/function/formatDateReturn';
import { ColdmapKey, controlReq, hotMapKey, temper } from '../../../utils/handleNumbers';
import down from '../../../assets/deviceIcons/slidedown.png';
import '../air.less';
const AirStatus = ({ sele }) => {
  const air = {
    parent: [
      {
        key_id: 1,
        highlight: 1,
        key_name: '@cword',
        key_image: '',
      },
      {
        key_id: 1,
        highlight: 1,
        key_name: '@cword',
        key_image: '',
      },
      {
        key_id: 1,
        highlight: 1,
        key_name: '@cword',
        key_image: '',
      },
      {
        key_id: 1,
        highlight: 1,
        key_name: '@cword',
        key_image: '',
      },
    ],
    sub: [
      {
        buttons: [
          {
            key_id: 1,
            key_img: '@image',
            key_name: '@cword',
            highlight: 1,
          },
        ],
        title: '@cword',
        equip_code: 1,
      },
      {
        buttons: [
          {
            key_id: 1,
            key_img: '@image',
            key_name: '@cword',
            highlight: 1,
          },
        ],
        title: '@cword',
        equip_code: 1,
      },
      {
        buttons: [
          {
            key_id: 1,
            key_img: '@image',
            key_name: '@cword',
            highlight: 1,
          },
        ],
        title: '@cword',
        equip_code: 1,
      },
    ],
    total: 5,
    highlight: 1,
    ui_type: 1,
    title: '空调',
    equip_type: 7,
  };
  const [collapse, setCollapse] = useState(false);
  const [visible, setV] = useState(false);
  const [collapseStyle, setStyle] = useState({});
  const handleCollapse = () => {
    setCollapse(!collapse);
    setV(!visible);
    setStyle(
      visible
        ? {
            border: '1px solid rgba(14, 79, 176, 1)',
          }
        : {
            borderTop: '1px solid #45e9fc',
            borderLeft: '1px solid #45e9fc',
            borderRight: '1px solid #45e9fc',
            borderBottom: '1px solid transparent',
          },
    );
  };
  return (
    <>
      <div className="airCondition" style={collapseStyle}>
        <div className="titleFlex">
          <Title title={air.title} />
          {air.total <= 4 ? null : (
            <div className="collapse" onClick={handleCollapse}>
              <span>
                {air.highLight}/{air.total}
              </span>
              <img
                alt="collapse"
                src={down}
                style={{ transform: collapse ? 'rotate(180deg)' : '' }}
              />
            </div>
          )}
        </div>
        <div className="airBtns">
          <div className="flexBtn">
            {air.parent.map(air => (
              <Item key={air.key_name} name={air.key_name} />
            ))}
          </div>
          <AirTem />
        </div>
      </div>
      {visible ? (
        <div className="airRest">
          {air.sub.map((item, index) => (
            <div
              className="restBlockWrap"
              style={{
                borderBottom: index + 1 === air.sub.length ? '' : '1px solid #45e9fc',
              }}
            >
              <div key={item.equip_code} className="airBtns bg">
                <div className="flexBtns">
                  <p>{item.title}</p>
                  <div className="noPicBtns">
                    {item.buttons.map(btn => (
                      <Button
                        className={btn.highLight === 1 || btn.highlight === 1 ? 'active' : ''}
                        key={btn.key_id}
                      >
                        {btn.key_name}
                      </Button>
                    ))}
                  </div>
                </div>
                <AirTem classname="btnPadding" />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

export default AirStatus;
const AirTem = ({ classname }) => {
  return (
    <div className={`airTem ${classname}`}>
      <span>{10}°C</span>
      <div className="sliderBar">
        <Slider className="slider" max={30} min={16} />
      </div>
    </div>
  );
};
