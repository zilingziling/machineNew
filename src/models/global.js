import { getMenus } from '@/service/login';

export default {
  namespace: 'global',
  state: {
    auth: [],
    moreMenu: [],
    assetsMenu: [],
  },
  effects: {
    *getAuth(_, { call, put, callback }) {
      const data = yield call(getMenus);
      if (data.code === 0) {
        yield put({
          type: 'saveAuth',
          payload: data.data,
        });
        if (callback) callback(data.data);
      }
    },
  },
  reducers: {
    saveAuth(state, { payload }) {
      let menuArr = [];
      let assetsArr = [];
      if (payload.length) {
        menuArr = payload[0].children.filter((item) => item.route === '/more')[0].children || [];
        assetsArr =
          payload[0].children.filter((item) => item.route === '/assetsManage')[0].children || [];
      }
      return {
        ...state,
        auth: payload,
        moreMenu: menuArr,
        assetsMenu: assetsArr,
      };
    },
  },
};
