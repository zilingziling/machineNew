import request from '@/utils/request';

export function getUserList(p) {
  return request('/integrated/user/userList', {
    method: 'get',
    params: p,
  });
}
export function getSchoolOfUser(p) {
  return request('/integrated/user/schoolData', {
    method: 'get',
    params: p,
  });
}
export function getRoles(p) {
  return request('/integrated/role/roleData', {
    method: 'get',
    params: p,
  });
}
export function add_edit(p) {
  return request('/integrated/user/edit', {
    method: 'get',
    params: p,
  });
}
export function changePwd(p) {
  return request('/integrated/user/editPwd', {
    method: 'get',
    params: p,
  });
}
export function delUser(p) {
  return request('/integrated/user/delete', {
    method: 'get',
    params: p,
  });
}
export function resetPwd(p) {
  return request('/integrated/user/resetPwd', {
    method: 'get',
    params: p,
  });
}
