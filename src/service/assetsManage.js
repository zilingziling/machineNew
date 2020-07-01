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
