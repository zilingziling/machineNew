import request from '@/utils/request';

export async function getStatus(p) {
  return request('/api/data', p);
}
