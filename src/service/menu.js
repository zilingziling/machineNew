import request from '@/utils/request';

export async function getMenuTree() {
  return request('/integrated/menu/menuList', {
    method: 'get',
  });
}
export function saveTree(p) {
  return request('/integrated/menu/save', {
    method: 'get',
    params: p,
  });
}
export function delMenu(p) {
  return request('/integrated/menu/delete', {
    method: 'get',
    params: p,
  });
}
// 操作列表
export function getOpeList(p) {
  return request('/integrated/operation/operationList', {
    method: 'get',
    params: p,
  });
}
export function getMenuCode() {
  return request('/integrated/dict/findByParent?code=operation', {
    method: 'get',
  });
}
export function saveOperation(p) {
  return request('/integrated/operation/save', {
    method: 'get',
    params: p,
  });
}
export function delOperation(p) {
  return request('/integrated/operation/delete', {
    method: 'get',
    params: p,
  });
}
