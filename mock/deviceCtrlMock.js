export default {
  'GET /api/data': {
    msg: '教室信息',
    code: 200,
    data: [
      {
        schoolData: '清水河校区/品学楼',
        deleteClassroom: '',
        deleteClassroomSize: 0,
        groupId: 1,
        classroomData: [
          {
            classroomType: 'off',
            masterEquipment: [
              {
                equipName: '爱思创中控模块',
                equipType: 'on',
                equipCode: 'mc_module',
              },
              {
                equipName: '爱思创中控模块',
                equipType: 'on',
                equipCode: 'module_schedule_control',
              },
              {
                equipName: '光峰投影',
                equipType: 'off',
                equipCode: 'projection',
              },
              {
                equipName: '爱思创面板',
                equipType: 'on',
                equipCode: 'mc_module_lock',
              },
            ],
            baseEquipment: [
              {
                equipName: '爱思创中控模块',
                keyData: [
                  {
                    keyName: '一键上课',
                    keyId: '78',
                  },
                  {
                    keyName: '一键下课',
                    keyId: '79',
                  },
                  {
                    keyName: '开启日程',
                    keyId: '120',
                  },
                  {
                    keyName: '关闭日程',
                    keyId: '121',
                  },
                ],
                equitCode: 'mc_module',
                equipclassroomId: '0173b58528da46ec85c552d82a9970b8',
              },
              {
                equipName: '光峰投影',
                keyData: [
                  {
                    keyName: '开机',
                    keyId: '1',
                  },
                  {
                    keyName: '关机',
                    keyId: '2',
                  },
                ],
                equitCode: 'projection',
                equipclassroomId: '1606ccdc5aa146808afb229eff3dff52',
              },
              {
                equipName: '爱思创电控锁',
                keyData: [
                  {
                    keyName: '开锁',
                    keyId: '115',
                  },
                  {
                    keyName: '关锁',
                    keyId: '116',
                  },
                ],
                equitCode: 'electricity_lock',
                equipclassroomId: '69cf10f514cf4bd9ade8f6457f97210f',
              },
              {
                equipName: '爱思创面板',
                keyData: [
                  {
                    keyName: '开锁',
                    keyId: '113',
                  },
                  {
                    keyName: '关锁',
                    keyId: '114',
                  },
                ],
                equitCode: 'mc_module_lock',
                equipclassroomId: 'ab62dfe780514790af5c808b72c63982',
              },
            ],
            classroomId: 70,
            classroom: 'A101品学楼',
            loading: false,
            url:
              'https://10.250.248.3/web/vtlp/f4e62815-fa19-4fee-9eb0-5d86c95df355/index.html#/main',
          },
        ],
      },
    ],
  },
};
