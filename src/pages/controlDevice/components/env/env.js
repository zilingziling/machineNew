import React from 'react';
import './env.scss';
import Title from '../common/tittle';
import tem from '../../../../assets/deviceIcons/temnormal.png';

const Square = ({ item, right = false, bottom = false }) => {
  return item ? (
    <div className={`square ${right ? 'borderR' : ''} ${bottom ? 'borderT' : ''}`}>
      <div className="imgWrapper">
        <img src={'http://172.16.3.207:8099/deviceapi/' + item.img} alt="airImg" />
      </div>
      <p className="normalColor">
        {item.name}：{item.value}
      </p>
      <p className="green">适宜</p>
    </div>
  ) : null;
};
const EnvStatus = ({ classRoomInfo, env }) => {
  return (
    <div className="classroomEnv">
      {env.length > 0 ? (
        <div className="roomEnv">
          <Title title="教室控制" />
          <div className="squares">
            {env.length >= 3 ? (
              <>
                <div className="top">
                  {env.slice(0, 3).map((item, index) => (
                    <Square
                      item={item}
                      key={item.name}
                      right={index === 0 || index === 1}
                      index={index}
                    />
                  ))}
                </div>
                <div className="bottom">
                  {env.slice(3).map((item, index) => (
                    <Square
                      index={index}
                      bottom={true}
                      item={item}
                      right={env.slice(3).length !== index + 1}
                      key={item.name}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="top">
                {env.map((item, index) => (
                  <Square
                    index={index}
                    right={env.length !== index + 1}
                    item={item}
                    key={item.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
      <div className="roomInfo">
        <Title title="教室信息" />
        <ul>
          {classRoomInfo.map((i, id) => (
            <li key={id}>
              <span>{i.name}</span>：
              <span
                style={{
                  color: i.value.includes('断开')
                    ? '#FD1F24'
                    : i.value.includes('连接')
                    ? '#45E9FC'
                    : '',
                }}
              >
                {i.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EnvStatus;
