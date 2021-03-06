import request from '@/utils/request';

export function getDeviceControlTree(p) {
  return request('/integrated/school/findSchoolTreeData', {
    method: 'get',
    params: p,
  });
}
export function getClassrooms(p) {
  return request('/integrated/control/data', {
    method: 'get',
    params: p,
  });
}
export function control(p) {
  return request('/integrated/control/batch', {
    method: 'post',
    data: p,
    requestType: 'form',
  });
}
