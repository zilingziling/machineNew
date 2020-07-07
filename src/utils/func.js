import React from 'react';
import { Divider } from 'antd';

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
export const formatTreeData = (res, uuid = false) => {
  let ant = [];
  res.forEach(e => {
    if (e.children && e.children.length) {
      ant.push({
        title: e.name,
        value: e.id,
        parent: e.parent,
        children: formatTreeData(e.children, uuid),
        id: e.id,
        key: uuid ? e.uuid : e.id,
        icon: e.icon,
        url: e.url,
        leaf: false,
        sort: e.sort,
        code: e.code,
      });
    } else {
      ant.push({
        title: e.name,
        value: e.id,
        parent: e.parent,
        id: e.id,
        key: uuid ? e.uuid : e.id,
        leaf: true,
        icon: e.icon,
        url: e.url,
        sort: e.sort,
        code: e.code,
      });
    }
  });
  return ant;
};
// treeSelect key value 都用uuid
export const formatTreeSelect = res => {
  let ant = [];
  res.forEach(e => {
    if (e.children && e.children.length) {
      ant.push({
        title: e.name,
        value: e.uuid,
        parent: e.parent,
        children: formatTreeSelect(e.children),
        id: e.id,
        key: e.uuid,
        icon: e.icon,
        url: e.url,
        leaf: false,
        sort: e.sort,
        code: e.code,
      });
    } else {
      ant.push({
        title: e.name,
        value: e.uuid,
        parent: e.parent,
        id: e.id,
        key: e.uuid,
        leaf: true,
        icon: e.icon,
        url: e.url,
        sort: e.sort,
        code: e.code,
      });
    }
  });
  return ant;
};
// 格式化操作菜单
export const formatOpeTree = data => {
  return data.map(v => {
    return {
      title: v.name,
      id: v.id,
      key: v.id,
      route: v.route,
      type: v.type,
      children: v.children ? formatOpeTree(v.children) : [],
    };
  });
};
// 找 教室的直接上级
export const getParentSchool = (classRoomId, treeData) => {
  let params = [];
  const findParent = (arr, item) => {
    arr.forEach(tree => {
      if (tree.children && tree.children.length) {
        if (tree.children.find(t => t.value === item)) {
          params.push({
            classroomId: item.replace(/[^0-9]/gi, ''),
            schoolId: tree.value.replace(/[^0-9]/gi, ''),
          });
        } else {
          findParent(tree.children, item);
        }
      }
    });
  };
  const findChildren = (arr, item) => {
    const findClassroom = arr => {
      arr.forEach(t => {
        if (t.value.includes('classroom')) {
          // 下级直接是教室（比如教学楼）
          params.push({
            classroomId: t.value.replace(/[^0-9]/gi, ''),
            schoolId: item.replace(/[^0-9]/gi, ''),
          });
        } else {
          if (t.children && t.children.length) {
            findClassroom(t.children);
          }
        }
      });
    };
    arr.forEach(tree => {
      if (tree.value === item) {
        if (tree.children && tree.children.length) {
          findClassroom(tree.children);
        }
      } else {
        // 找value一样的
        if (tree.children && tree.children.length) {
          findChildren(tree.children, item);
        }
      }
    });
  };
  classRoomId.forEach(item => {
    if (item.includes('classroom')) {
      // 选中的是教室 找他的直接父级的id 例如classroom12
      // item 是每一个classroomId
      findParent(treeData, item);
    } else {
      //  选中的是学校（父级） 找他下面的教室 例如school12
      findChildren(treeData, item);
    }
  });
  return params;
};
