import request from '@/utils/request';

export function getMaintainList(p) {
  return request('/integrated/maintainer/list', {
    method: 'get',
    params: p,
  });
}
export function getMaintainType(p) {
  return request('/integrated/dict/findByParent?code=responsible', {
    method: 'get',
    params: p,
  });
}
export function getMaintainer(p) {
  return request('/integrated/maintainer/userData', {
    method: 'get',
    params: p,
  });
}
export function firstStep(p) {
  return request('/integrated/maintainer/save', {
    method: 'get',
    params: p,
  });
}
// 保存区域类别
export async function saveDict(p) {
  return request('/integrated/maintainer/saveClassroomData', {
    method: 'post',
    data: p,
    requestType: 'form',
  });
}
// 保存类型和品牌
export async function saveTypeBrands(p) {
  return request('/integrated/maintainer/saveTypeBrand', {
    method: 'post',
    data: p,
    requestType: 'form',
  });
}
// 删除维修人员
export function delMaintain(p) {
  return request('/integrated/maintainer/delete', {
    method: 'get',
    params: p,
  });
}
// 维修人员编辑信息
export function getMaintainEdit(p) {
  return request('/integrated/maintainer/detail', {
    method: 'get',
    params: p,
  });
}
//
export function getFactoryList(p) {
  return request('/integrated/manufacturer/list', {
    method: 'get',
    params: p,
  });
}
export function factoryFirstSave(p) {
  return request('/integrated/manufacturer/save', {
    method: 'post',
    data: p,
    requestType: 'form',
  });
}
export async function saveFactoryTypeBrands(p) {
  return request('/integrated/manufacturer/saveTypeBrand', {
    method: 'post',
    data: p,
    requestType: 'form',
  });
}
export async function saveFactoryClassInfo(p) {
  return request('/integrated/manufacturer/saveClassroomData', {
    method: 'post',
    data: p,
    requestType: 'form',
  });
}
export function getFactoryEdit(p) {
  return request('/integrated/manufacturer/detail', {
    method: 'get',
    params: p,
  });
}
export function delFactory(p) {
  return request('/integrated/manufacturer/delete', {
    method: 'get',
    params: p,
  });
}
// 资产列表
export function getAssetsList(p) {
  return request('/integrated/assets/list', {
    method: 'get',
    params: p,
  });
}
// 维修人下拉
export function getMaintainSelect(p) {
  return request('/integrated/maintainer/data', {
    method: 'get',
    params: p,
  });
}
export function delAssets(p) {
  return request('/integrated/assets/delete', {
    method: 'get',
    params: p,
  });
}
export function getYear(p) {
  return request('/integrated/dict/findByParent?code=useYear', {
    method: 'get',
    params: p,
  });
}
export function getFactorySelect(p) {
  return request('/integrated/manufacturer/data', {
    method: 'get',
    params: p,
  });
}
export async function addAssets(p) {
  return request('/integrated/assets/save', {
    method: 'post',
    data: p,
    requestType: 'form',
  });
}
