import request from '@/utils/request';

export function getRoleTree() {
  return request('/integrated/role/operationTree', {
    method: 'get',
  });
}
export function addRole(p) {
  return request('/integrated/role/save', {
    method: 'get',
    params: p,
  });
}
export function getRoleList(p) {
  return request('/integrated/role/roleList', {
    method: 'get',
    params: p,
  });
}
export function delRole(p) {
  return request('/integrated/role/delete', {
    method: 'get',
    params: p,
  });
}
