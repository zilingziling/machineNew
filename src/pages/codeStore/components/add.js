import React, { useEffect, useState } from 'react';
import BaseModal from '@/components/baseModal';
import { Tabs, Form, Input, Select, Radio } from 'antd';
import { formLayout } from '@/utils/func';
import {
  getBaudRate,
  getConnectCode,
  getConnectWay,
  getDataBit,
  getStopBit,
  getVerify,
} from '@/service/codeStore';
const { TabPane } = Tabs;
const Add = ({ modalV, setModalV, title, types, brand }) => {
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
  const onOk = () => {
    if (activeKey === '1') {
      setActiveKey('2');
    } else if (activeKey === '2') {
      setActiveKey('3');
    } else if (activeKey === '3') {
    }
  };
  const cancel = () => {
    if (activeKey === '1') {
      setModalV(false);
    } else if (activeKey === '2') {
      setActiveKey('1');
    } else if (activeKey === '3') {
      setActiveKey('2');
    }
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
    >
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
          <Radio.Group onChange={e => setCode(e.target.value)}>
            {connectWay.map(item => (
              <Radio key={item.id} value={item.id}>
                {item.name}
              </Radio>
            ))}
          </Radio.Group>
          <Form className="mt1" {...formLayout} form={form} name="second">
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
                  <Select.Option value={type.id} key={type.id}>
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
                      <Select.Option value={type.id} key={type.id}>
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
                      <Select.Option value={type.id} key={type.id}>
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
                      <Select.Option value={type.id} key={type.id}>
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
                      <Select.Option value={type.id} key={type.id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            ) : (
              ''
            )}
          </Form>
        </TabPane>
        <TabPane tab="控制数据" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </BaseModal>
  );
};
export default Add;
