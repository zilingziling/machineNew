import React, { useEffect, useState } from 'react';
import { Form, Input, notification, Button, InputNumber, Select, TreeSelect } from 'antd';
import {
  add_edit,
  addDevice,
  getBrandsTree,
  getCommands,
  getDeviceConfigTree,
  getTypes,
} from '@/service/device';
import BaseModal from '@/components/baseModal';
import { layout } from '@/utils/common';
import { formatTreeData, treeSelectStyle } from '@/utils/func';
import {
  getBaudRate,
  getCodingWay,
  getConnectWay,
  getDataBit,
  getStopBit,
  getVerify,
} from '@/service/codeStore';
const flex = {
  display: 'flex',
  alignItems: 'center',
};
const DeviceConfigModal = ({
  modalTitle,
  modalV,
  setModalV,
  getTable,
  editInfo,
  classroomId,
  command,
  setCommand,
  setChooseV,
}) => {
  const [form] = Form.useForm();
  const [baudRate, setBaudRate] = useState(''); // 波特率
  const [dataBit, setDataBit] = useState(''); // 数据位
  const [stopBit, setStopBit] = useState(''); // 停止位
  const [verify, setVerify] = useState(''); // 校验
  const [classroomTree, setClassroom] = useState([]);
  const onModalCancel = () => {
    setModalV(false);
  };
  const [typeId, setTypeId] = useState('');
  //  编辑回显
  useEffect(() => {
    console.log(editInfo);
    if (Object.keys(editInfo).length) {
      form.setFieldsValue({
        name: editInfo.brand + editInfo.type,
        'type.id': editInfo.typeId || editInfo.type_id,
        'brand.id': editInfo.brandId || editInfo.brand_id,
        serialNumber: editInfo.serialNumber,
        equipmentSort: editInfo.equipmentSort,
        model: editInfo.model,
        baudRate: editInfo.baud_rate,
        dataBit: editInfo.date_bit,
        stopBit: editInfo.stop_bit,
        verify: editInfo.verify,
        ip: editInfo.ip,
        port: editInfo.port,
        username: editInfo.username,
        password: editInfo.password,
        redLine: editInfo.red_line,
      });
      if (editInfo.commands && editInfo.commands.length) {
        let formatedCommad = [];
        getCommands({ typeId: editInfo.typeId }).then(r => {
          if (r.code === 0 && r.data.length) {
            editInfo.commands.forEach(i => {
              r.data.forEach(j => {
                if (i.id === j.id) {
                  formatedCommad.push({
                    ...i,
                    ...j,
                  });
                }
              });
            });
            setCommand(formatedCommad);
          } else {
            setCommand([]);
          }
        });
      } else setCommand([]);
    } else {
      form.resetFields();
    }
  }, [editInfo]);

  const onModalOk = () => {
    form
      .validateFields()
      .then(value => {
        if (value) {
          let params = { ...value };
          let controlCommandIds = command.map(item => item.id);
          let commands = command.map(item => {
            if (value[item.id]) {
              return value[item.id];
            }
          });
          // 码库相关
          params['connectionWay.id'] = editInfo.connection_way_id;
          params['connectOpening'] = editInfo.connect_opening;
          params['codingWay.id'] = editInfo.coding_way_id;
          params['classroom.id'] = classroomId;
          params.name = value.name;
          params['type.id'] = value['type.id'];
          params['brand.id'] = value['brand.id'];
          params['classroom.id'] = classroomId;
          params.commands = commands;
          params.controlCommandIds = controlCommandIds;
          params.serialNumber = value.serialNumber;
          params.model = value.model;
          if (modalTitle.includes('编辑')) {
            params.id = editInfo.id;
            params.equipmentSort = value.equipmentSort;
          }
          addDevice(params).then(r => {
            if (r.code === 0) {
              notification.success({
                message: r.msg,
              });
              getTable();
              onModalCancel();
            }
          });
        }
      })
      .catch(() => {});
  };
  // 获取设备类型等下拉菜单
  const [types, setType] = useState([]);
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    getTypes().then(r => {
      if (r.code === 0) {
        setType(r.data);
      }
    });
    getBrandsTree().then(r => {
      if (r.code === 0) {
        setBrands(r.data);
      }
    });
    getDeviceConfigTree().then(r => {
      setClassroom(formatTreeData(r.data, true));
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
  // form  值改变
  const formValueChange = (changedValues, allValues) => {
    if (allValues['brand.id'] && allValues['type.id']) {
      form.setFieldsValue({
        name: getName(allValues['type.id'], allValues['brand.id']),
      });
    }
    if (allValues['type.id']) {
      types.forEach(item => {
        if (item.id === allValues['type.id'] && item.code === 'mc_module') {
          setShow(true);
        } else setShow(false);
      });
      setTypeId(allValues['type.id']);
    } else setTypeId('');
  };
  const getName = (typeId, brandId) => {
    let typeName = '';
    let brandName = '';
    types.forEach(item => {
      if (item.id === typeId) {
        typeName = item.name;
      }
    });
    brands.forEach(item => {
      if (item.id === brandId) {
        brandName = item.name;
      }
    });
    return brandName + typeName;
  };
  const [show, setShow] = useState(false);

  useEffect(() => {
    getCommands({ typeId }).then(r => {
      if (r.code === 0) {
        setCommand(r.data);
      } else setCommand([]);
    });
  }, [typeId]);
  const onClickChoose = () => {
    setChooseV(true);
    setModalV(false);
  };
  return (
    <BaseModal
      width={600}
      onOk={onModalOk}
      title={modalTitle}
      visible={modalV}
      onCancel={onModalCancel}
    >
      <Form form={form} {...layout} className="mt1" onValuesChange={formValueChange}>
        <Form.Item label="设备类型">
          <div style={{ display: 'flex' }}>
            <Form.Item
              rules={[{ required: true, message: '请选择设备类型！' }]}
              noStyle
              name="type.id"
            >
              <Select className="mr1">
                {types.map(type => (
                  <Select.Option value={type.id} key={type.id}>
                    {type.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button className="shadowBtn" onClick={onClickChoose}>
              选择设备
            </Button>
          </div>
        </Form.Item>
        <Form.Item
          name="brand.id"
          label="品牌"
          rules={[{ required: true, message: '请选择设备品牌！' }]}
        >
          <Select className="mr1">
            {brands.map(type => (
              <Select.Option value={type.id} key={type.id}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="name" label="设备名称">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="model"
          label="设备型号"
          rules={[{ required: true, message: '请选择设备型号！' }]}
        >
          <Input />
        </Form.Item>
        {modalTitle.includes('编辑') && (
          <Form.Item
            name="equipmentSort"
            label="设备序号"
            rules={[{ required: true, message: '请输入设备序号！' }]}
          >
            <Input />
          </Form.Item>
        )}
        {show && (
          <Form.Item
            name="serialNumber"
            label="串号"
            rules={[{ required: true, message: '请输入中控串号！' }]}
          >
            <Input />
          </Form.Item>
        )}
        {command.length
          ? command.map(item => (
              <Form.Item
                key={item.id}
                name={item.id}
                label={item.name}
                initialValue={item.command}
                rules={[{ required: true, message: '请输入控制指令！' }]}
              >
                <Input />
              </Form.Item>
            ))
          : null}
        {editInfo.connectionWay === 'RS232' || editInfo.connectionWay === 'RS485' ? (
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
        {editInfo.connectionWay === 'network' ? (
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
        {editInfo.connectionWay === 'redLine' ? (
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
    </BaseModal>
  );
};
export default DeviceConfigModal;
