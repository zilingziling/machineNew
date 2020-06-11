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
