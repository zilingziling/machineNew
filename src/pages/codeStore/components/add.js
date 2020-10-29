import React, { useEffect, useState } from 'react';
import BaseModal from '@/components/baseModal';
import { Tabs, Form, Input, Select, Radio, TreeSelect, notification } from 'antd';
import { formatTreeData, formLayout, treeSelectStyle } from '@/utils/func';
import styles from '../index.less';
import {
  getBaudRate,
  getCodingWay,
  getConnectCode,
  getConnectWay,
  getDataBit,
  getStopBit,
  getVerify,
  saveCodeStore,
} from '@/service/codeStore';
import moment from 'moment';
import { getDeviceConfigTree } from '@/service/device';
const { TabPane } = Tabs;
const Add = ({ modalV, setModalV, title, types, brand, getTable, editInfo }) => {
  const [form] = Form.useForm();
  const [okText, setOkText] = useState('下一步');
  const [cancelText, setCancelText] = useState(null);
  const [activeKey, setActiveKey] = useState('1');
  const [connectWay, setConnectWay] = useState([]);
  const [code, setCode] = useState(''); // 选择的连接方式
  const [codeData, setCodeData] = useState([]); // 连接口
  const [codeName, setCodeName] = useState(''); // 连接方式名称
  const [baudRate, setBaudRate] = useState(''); // 波特率
  const [dataBit, setDataBit] = useState(''); // 数据位
  const [stopBit, setStopBit] = useState(''); // 停止位
  const [verify, setVerify] = useState(''); // 校验
  const [codingWay, setCodingWay] = useState([]); // 编码方式
  const [classroomTree, setClassroom] = useState([]);
  //  编辑回显
  useEffect(() => {
    if (Object.keys(editInfo).length && title.includes('编辑')) {
      console.log(editInfo);
      let p = connectWay.find(item => item.id === editInfo.connection_way_id);
      setCodeName(p.code);
      form.setFieldsValue({
        username: editInfo.username,
        password: editInfo.password,
        model: editInfo.model,
        'type.id': editInfo.type_id,
        'brand.id': editInfo.brand_id,
        'connectionWay.id': editInfo.connection_way_id,
        connectOpening: editInfo.connect_opening,
        baudRate: editInfo.baud_rate,
        dataBit: editInfo.date_bit,
        stopBit: editInfo.stop_bit,
        verify: editInfo.verify,
        ip: editInfo.ip,
        port: editInfo.port,
        'codingWay.id': editInfo.coding_way_id,
      });
    } else {
      form.resetFields();
    }
  }, [editInfo]);
  const onOk = () => {
    let nameList = [];
    if (activeKey === '1') {
      form
        .validateFields(['brand.id', 'type.id', 'model'])
        .then(value => {
          setActiveKey('2');
        })
        .catch(err => {});
    } else if (activeKey === '2') {
      nameList = ['brand.id', 'type.id', 'model', 'connectionWay.id', 'connectOpening'];
      if (codeName === 'RS232' || codeName === 'RS485') {
        nameList = [...nameList, 'baudRate', 'dataBit', 'stopBit', 'verify'];
      } else if (codeName === 'network') {
        nameList = [...nameList, 'port', 'username', 'password'];
      } else if (codeName === 'redLine') {
        nameList = [...nameList, 'redLine'];
      }
      form
        .validateFields(nameList)
        .then(value => {
          setActiveKey('3');
        })
        .catch(err => {});
    } else if (activeKey === '3') {
      form.validateFields(['codingWay.id', ...nameList]).then(value => {
        const p = { ...value };
        if (title.includes('编辑')) {
          p.id = editInfo.id;
        }
        saveCodeStore(p).then(r => {
          if (r.code === 0) {
            notification.success({
              message: r.msg,
            });
          }
          getTable();
          form.resetFields();
          setModalV(false);
          setActiveKey('1');
        });
      });
    }
  };
  const cancel = () => {
    if (activeKey === '1') {
      setModalV(false);
      form.resetFields();
      setActiveKey('1');
    } else if (activeKey === '2') {
      setActiveKey('1');
    } else if (activeKey === '3') {
      setActiveKey('2');
    }
  };
  const onCloseModal = () => {
    setActiveKey('1');
    setModalV(false);
  };
  // 设置活跃键
  useEffect(() => {
    if (activeKey === '1') {
      setOkText('下一步');
      setCancelText(null);
    } else if (activeKey === '2') {
      setOkText('下一步');
      setCancelText('上一步');
    } else if (activeKey === '3') {
      setOkText('完成');
      setCancelText('上一步');
    }
  }, [activeKey]);
  // 获取下拉框参数
  useEffect(() => {
    getDeviceConfigTree().then(r => {
      setClassroom(formatTreeData(r.data, true));
    });
    getConnectWay().then(r => {
      if (r.code === 0) {
        setConnectWay(r.data);
      }
    });
    getBaudRate().then(r => {
      if (r.code === 0) {
        setBaudRate(r.data);
      }
    });
    getDataBit().then(r => {
      if (r.code === 0) {
        setDataBit(r.data);
      }
    });
    getStopBit().then(r => {
      if (r.code === 0) {
        setStopBit(r.data);
      }
    });
    getVerify().then(r => {
      if (r.code === 0) {
        setVerify(r.data);
      }
    });
    getCodingWay().then(r => {
      if (r.code === 0) {
        setCodingWay(r.data);
      }
    });
  }, []);
  // 获取连接code
  useEffect(() => {
    if (code) {
      let p = connectWay.find(item => item.id === code);
      setCodeName(p.code);
      getConnectCode({ code: p.code || '' }).then(r => {
        if (r.code === 0) {
          setCodeData(r.data); // 连接口
        }
      });
    }
  }, [code]);
  return (
    <BaseModal
      onOk={onOk}
      okText={okText}
      cancelText={cancelText}
      onCancel={cancel}
      title={title}
      visible={modalV}
      closable={false}
      maskClosable={false}
      width={620}
    >
      <img
        onClick={onCloseModal}
        className={styles.close}
        alt="close"
        src={require('../../../assets/images/close.png')}
      />
      <Tabs activeKey={activeKey} tabPosition="left" defaultActiveKey="1" disabled>
        <TabPane tab="设备信息" key="1">
          <Form {...formLayout} form={form} name="first">
            <Form.Item
              name="type.id"
              label="设备类型"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select className="mr1">
                {types.map(type => (
                  <Select.Option value={type.id} key={type.id}>
                    {type.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="brand.id"
              label="品牌"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select className="mr1">
                {brand.map(type => (
                  <Select.Option value={type.id} key={type.id}>
                    {type.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="model"
              label="设备型号"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="连接方式" key="2">
          <Form className="mt1" {...formLayout} form={form} name="second">
            <Form.Item
              name="connectionWay.id"
              label="连接方式"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group onChange={e => setCode(e.target.value)}>
                {connectWay.map(item => (
                  <Radio key={item.id} value={item.id}>
                    {item.name}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="connectOpening"
              label="连接口"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select className="mr1">
                {codeData.map(type => (
                  <Select.Option value={type.code} key={type.id}>
                    {type.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {codeName === 'RS232' || codeName === 'RS485' ? (
              <>
                <Form.Item
                  name="baudRate"
                  label="波特率"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select className="mr1">
                    {baudRate.map(type => (
                      <Select.Option value={type.code} key={type.id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="dataBit"
                  label="数据位"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select className="mr1">
                    {dataBit.map(type => (
                      <Select.Option value={type.code} key={type.id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="stopBit"
                  label="停止位"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select className="mr1">
                    {stopBit.map(type => (
                      <Select.Option value={type.code} key={type.id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="verify"
                  label="校验"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select className="mr1">
                    {verify.map(type => (
                      <Select.Option value={type.code} key={type.id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            ) : null}
            {codeName === 'network' ? (
              <>
                <Form.Item
                  name="port"
                  label="端口号"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="username" label="用户名">
                  <Input />
                </Form.Item>
                <Form.Item name="password" label="密码">
                  <Input />
                </Form.Item>
              </>
            ) : null}
            {codeName === 'redLine' ? (
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请选择教室！',
                  },
                ]}
                name="redLine"
                label="选择教室"
              >
                <TreeSelect
                  treeData={classroomTree}
                  dropdownStyle={treeSelectStyle}
                  placeholder="选择教室用于红外学习"
                />
              </Form.Item>
            ) : null}
          </Form>
        </TabPane>
        <TabPane tab="控制数据" key="3">
          <Form className="mt1" {...formLayout} form={form} name="third">
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              name="codingWay.id"
              label="编码方式"
            >
              <Radio.Group>
                {codingWay.map(item => (
                  <Radio key={item.id} value={item.id}>
                    {item.name}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </BaseModal>
  );
};
export default Add;
