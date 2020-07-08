import React from 'react';
import styles from '../index.less';
export const getTooltips = () => {
  const data = [
    {
      name: '电脑开启',
      img: require('../../../assets/deviceControl/greenP.png'),
    },
    {
      name: '电脑关闭',
      img: require('../../../assets/deviceControl/whiteP.png'),
    },
    {
      name: '投影开启',
      img: require('../../../assets/deviceControl/greenP.png'),
    },
    {
      name: '投影开启',
      img: require('../../../assets/deviceControl/whiteP.png'),
    },
    {
      name: '面板解锁',
      img: require('../../../assets/deviceControl/greenL.png'),
    },
    {
      name: '面板锁定',
      img: require('../../../assets/deviceControl/whiteL.png'),
    },
  ];
  return (
    <ul className={styles.tooltip}>
      <li>
        <div className={styles.classOn}></div>
        <span>教室上课</span>
      </li>
      <li>
        <div className={styles.classOff}></div>
        <span>教室下课</span>
      </li>
      <li>
        <div className={styles.toolRed}>C</div>
        <span>中控离线</span>
      </li>
      <li>
        <div className={styles.toolRed}>M</div>
        <span>扩声未开</span>
      </li>
      {data.map((item, index) => (
        <li key={index}>
          <img alt="icon" src={item.img} />
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  );
};
export const getSingleTooltip = (classroomStatus, masterEquipment, moduleStatus) => {
  const data = [
    {
      name: '中控',
      value: moduleStatus === 'on' ? '在线1' : '离线0',
    },
    {
      name: '教室',
      value: classroomStatus === 'on' ? '上课1' : '下课0',
    },
  ];
  const getValue = (code, value) => {
    switch (code) {
      case 'computer' || 'projection':
        return value === 'on' ? '开启1' : value === 'off' ? '关闭0' : '';
      case 'mc_module_lock':
        return value === 'on' ? '解锁1' : value === 'off' ? '锁定0' : '';
      default:
        return '';
    }
  };
  let a = masterEquipment.filter(i => i.status !== 'none');
  if (a.length) {
    a.forEach(i => {
      data.push({
        name:
          i.code === 'computer'
            ? '电脑'
            : i.code === 'projection'
            ? '投影'
            : i.code === 'mc_module_lock'
            ? '面板'
            : '',
        value: getValue(i.code, i.status),
      });
    });
  }

  return (
    <ul className={styles.singleTool}>
      {data.map((item, index) => (
        <li key={index}>
          <span
            className={
              item.value.replace(/[^0-9]/gi, '') === '1' ? `${styles.green}` : `${styles.red}`
            }
          >{`${item.name}：`}</span>
          <span
            className={
              item.value.replace(/[^0-9]/gi, '') === '1' ? `${styles.green}` : `${styles.red}`
            }
          >
            {item.value.match(/[\u4e00-\u9fa5]/g)}
          </span>
        </li>
      ))}
    </ul>
  );
};
// 都初始化为未选中状态
export const initClassroomData = arr => {
  arr.forEach(item => {
    item.classroomData.forEach(room => (room.checkStatus = false));
  });
  return arr;
};
// 渲染设备图标
export const getImgUrl = i => {
  const { code, status } = i;
  switch (code) {
    case 'computer':
      return status === 'on'
        ? require('../../../assets/deviceControl/greenC.png')
        : status === 'off'
        ? require('../../../assets/deviceControl/whiteC.png')
        : null;
    case 'projection':
      return status === 'on'
        ? require('../../../assets/deviceControl/greenP.png')
        : status === 'off'
        ? require('../../../assets/deviceControl/whiteP.png')
        : null;
    case 'mc_module_lock':
      return status === 'on'
        ? require('../../../assets/deviceControl/greenL.png')
        : status === 'off'
        ? require('../../../assets/deviceControl/whiteL.png')
        : null;
    default:
      return null;
  }
};
