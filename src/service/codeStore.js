import request from '@/utils/request';

// 码库列表
export function getCodeList(p) {
  return request('/integrated/code/list', {
    method: 'get',
    params: p,
  });
}
// 连接方式
export function getConnectWay(p) {
  return request('/integrated/dict/findByParent?code=connectionWay', {
    method: 'get',
  });
}
export function getConnectCode(p) {
  return request(`/integrated/dict/findByParent`, {
    method: 'get',
    params: p,
  });
}
// 波特率
export function getBaudRate(p) {
  return request('/integrated/dict/findByParent?code=baudRate', {
    method: 'get',
  });
}
// 数据位
export function getDataBit(p) {
  return request('/integrated/dict/findByParent?code=dataBit', {
    method: 'get',
  });
}
// 停止位
export function getStopBit(p) {
  return request('/integrated/dict/findByParent?code=stopBit', {
    method: 'get',
  });
}
// 校验
export function getVerify(p) {
  return request('/integrated/dict/findByParent?code=verify', {
    method: 'get',
  });
}
// 编码方式
export function getCodingWay(p) {
  return request('/integrated/dict/findByParent?code=codingWay', {
    method: 'get',
  });
}
// 保存码库
export function saveCodeStore(p) {
  return request('/integrated/code/save', {
    method: 'post',
    data: p,
    requestType: 'form',
  });
}
// 删除码库
export function delCodeStore(p) {
  return request('/integrated/code/delete', {
    method: 'post',
    data: p,
    requestType: 'form',
  });
}
