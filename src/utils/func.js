import React from 'react';

export function showTotal(totalPage, total) {
  return (
    <p className="white">
      共 <span className="blue">{totalPage}</span> 页/
      <span className="blue">{total}</span> 条数据
    </p>
  );
}

export function mobileValidator(rule, value, callback) {
  if (value) {
    const reg = /^(0|[1-9][0-9]*)$/;
    if (!reg.test(value)) {
      callback('请输入正确的电话号码!');
    }
  }
  callback();
}
export function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export const EventUtil = {
  addHandle: function(element, type, handle) {
    if (element.addEventListener) {
      element.addEventListener(type, handle);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handle);
    } else {
      element['on' + type] = handle;
    }
  },
  removeHandle: function(element, type, handle) {
    if (element.removeEventListener) {
      element.removeListener(type, handle);
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handle);
    } else {
      element['on' + type] = null;
    }
  },
};
export const uint8Buff2Str = u8array => {
  var str = '';
  for (var i = 0; i < u8array.length; i++) {
    str += String.fromCharCode(u8array[i]);
  }
  return str;
};
export const findPosition = (data, key) => {
  data.map(item => {
    if (item.key === key) {
      console.log(item);
    } else if (item.children) {
      findPosition(item.children, key);
    }
  });
};
//  格式化树菜单
export const formatTreeData = res => {
  let ant = [];
  res.forEach(e => {
    if (e.children && e.children.length) {
      ant.push({
        title: e.name,
        value: e.id,
        parent: e.parent,
        children: formatTreeData(e.children),
        id: e.id,
        key: e.id,
        icon: e.icon,
        url: e.url,
        leaf: false,
        sort: e.sort,
      });
    } else {
      ant.push({
        title: e.name,
        value: e.id,
        parent: e.parent,
        id: e.id,
        key: e.id,
        leaf: true,
        icon: e.icon,
        url: e.url,
        sort: e.sort,
      });
    }
  });
  return ant;
};
