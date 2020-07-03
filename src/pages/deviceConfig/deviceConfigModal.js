import React, { useEffect, useState } from 'react';
import { Form, Input, notification, Button, InputNumber, Select } from 'antd';
import { add_edit, addDevice, getBrandsTree, getCommands, getTypes } from '@/service/device';
import BaseModal from '@/components/baseModal';
import { layout } from '@/utils/common';

const DeviceConfigModal = ({
  modalTitle,
  modalV,
  setModalV,
  getTable,
  editInfo,
  classroomId,
  command,
  setCommand,
}) => {
  const [form] = Form.useForm();

  const onModalCancel = () => {
    setModalV(false);
  };
  const [typeId, setTypeId] = useState('');
  //  编辑回显
  useEffect(() => {
    if (Object.keys(editInfo).length && modalTitle.includes('编辑')) {
      console.log(editInfo);
      form.setFieldsValue({
        name: editInfo.name,
        'type.id': editInfo.typeId,
        'brand.id': editInfo.brandId,
        serialNumber: editInfo.serialNumber,
        equipmentSort: editInfo.equipmentSort,
      });
      if (editInfo.commands.length) {
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
          console.log(value);
          let params = {};
          let controlCommandIds = command.map(item => item.id);
          let commands = command.map(item => {
            if (value[item.id]) {
              console.log(value[item.id]);
              return value[item.id];
            }
          });
          params['classroom.id'] = classroomId;
          params.name = value.name;
          params['type.id'] = value['type.id'];
          params['brand.id'] = value['brand.id'];
          params['classroom.id'] = classroomId;
          params.commands = commands;
          console.log(commands);
          params.controlCommandIds = controlCommandIds;
          params.serialNumber = value.serialNumber;
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
  return (
    <BaseModal onOk={onModalOk} title={modalTitle} visible={modalV} onCancel={onModalCancel}>
      <Form form={form} {...layout} className="mt1" onValuesChange={formValueChange}>
        <Form.Item
          name="type.id"
          label="设备类型"
          rules={[{ required: true, message: '请选择设备类型！' }]}
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
      </Form>
    </BaseModal>
  );
};
export default DeviceConfigModal;
