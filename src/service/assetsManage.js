import request from '@/utils/request';

export function getMaintainList(p) {
  return request('/integrated/maintainer/list', {
    method: 'get',
    params: p,
  });
}
export function delMaintain(p) {
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
