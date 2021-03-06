import request from '@/utils/request';

// 品牌管理
export function getBrandList(p) {
  return request('/integrated/brand/list', {
    method: 'get',
    params: p,
  });
}
export function add_edit(p) {
  return request('/integrated/brand/save', {
    method: 'get',
    params: p,
  });
}
export function del(p) {
  return request('/integrated/brand/delete', {
    method: 'get',
    params: p,
  });
}
// 设备类型管理
export function getDtypeList(p) {
  return request('/integrated/type/list', {
    method: 'get',
    params: p,
  });
}
export function uploadImg(p) {
  return request('/integrated/type/save', {
    method: 'get',
    params: p,
  });
}
export function operate(p) {
  return request('/integrated/type/save', {
    method: 'get',
    params: p,
  });
}
export function delType(p) {
  return request('/integrated/type/delete', {
    method: 'get',
    params: p,
  });
}
export function getTypes(p) {
  return request('/integrated/type/data', {
    method: 'get',
    params: p,
  });
}
// 设备功能管理
export function getFuncList(p) {
  return request('/integrated/command/list', {
    method: 'get',
    params: p,
  });
}
export function operateFunc(p) {
  return request('/integrated/command/save', {
    method: 'get',
    params: p,
  });
}
export function delFunc(p) {
  return request('/integrated/command/delete', {
    method: 'get',
    params: p,
  });
}
// 设备配置
export function getDeviceConfig(p) {
  return request('/integrated/equipment/list', {
    method: 'get',
    params: p,
  });
}
export function getDeviceConfigTree(p) {
  return request('/integrated/equipment/classroomTree', {
    method: 'get',
    params: p,
  });
}
export function getBrandsTree(p) {
  return request('/integrated/brand/data', {
    method: 'get',
    params: p,
  });
}
export function getCommands(p) {
  return request('/integrated/equipment/commandData', {
    method: 'get',
    params: p,
  });
}
export function addDevice(p) {
  return request('/integrated/equipment/save', {
    method: 'get',
    params: p,
  });
}
export function delDevice(p) {
  return request('/integrated/equipment/delete', {
    method: 'get',
    params: p,
  });
}
export function getDetails(p) {
  return request('/integrated/equipment/detail', {
    method: 'get',
    params: p,
  });
}
