import request from '@/utils/request';

export async function login(p) {
  return request('integrated/login', {
    method: 'get',
    params: p,
  });
}
export async function getMenus() {
  return request('integrated/menu/loginMenu', {
    method: 'get',
  });
}
