import { getDeviceControlTree } from '@/service/deviceControl';
import { formatTreeData } from '@/utils/func';

export default {
  namespace: 'deviceControl',
  state: {
    treeData: [],
  },
  effects: {
    *getDeviceCtrlTree(_, { call, put }) {
      const data = yield call(getDeviceControlTree);
      if (data.code === 0) {
        yield put({
          type: 'saveTreeData',
          payload: data.data,
        });
      }
    },
  },
  reducers: {
    saveTreeData(state, { payload }) {
      return {
        ...state,
        treeData: formatTreeData(payload),
      };
    },
  },
  subscriptions: {},
};
