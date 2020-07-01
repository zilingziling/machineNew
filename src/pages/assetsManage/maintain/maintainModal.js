import React, { useEffect, useState } from 'react';
import { Form, Input, notification, Radio, Select, Button, Divider, TreeSelect } from 'antd';
import { w250, roleLayout } from '../../../utils/common';
import { add_edit, getDeviceConfigTree } from '@/service/device';
import BaseModal from '@/components/baseModal';
import {
  firstStep,
  getMaintainer,
  getMaintainType,
  saveDict,
  saveTypeBrands,
} from '@/service/assetsManage';
import ChooseType from '@/pages/assetsManage/maintain/chooseType';
import styles from './index.less';
import { formatTreeData, formatTreeSelect, getParentSchool } from '@/utils/func';
const { Option } = Select;
const MaintainModal = ({ modalTitle, modalV, setModalV, getTable, editInfo }) => {
  const [form] = Form.useForm();
  const [maintainerId, setMaintainerId] = useState('');
  // 选择品类弹窗
  const [chooseV, setChooseV] = useState(false);
  const [info, setInfo] = useState({});
  // 参数
  const [maintainerTypeBrands, setTypeBrands] = useState([{}]);
  //
  const onModalCancel = () => {
    setModalV(false);
    form.resetFields();
    setTab(1);
  };
  //  编辑回显
  useEffect(() => {
    console.log(editInfo);
    if (Object.keys(editInfo).length && modalTitle.includes('编辑')) {
      form.setFieldsValue({
        name: editInfo.name,
        phone: editInfo.phone,
        'user.id': account.find((item) => item.account === editInfo.account).id,
        'dict.id': editInfo.dictId,
      });
      if (maintainType.find((item) => item.id === editInfo.dictId).name.includes('区域')) {
        setOkText('下一步');
      }
    } else {
      form.resetFields();
    }
  }, [editInfo]);

  const onModalOk = () => {
    form
      .validateFields()
      .then(async (value) => {
        if (value) {
          let params = value;
          if (modalTitle.includes('编辑')) {
            params.id = editInfo.id;
          }
          if (okText.includes('下一步')) {
            //

            firstStep(params).then((r) => {
              if (r.code === 0) {
                setMaintainerId(r.data.id);
                setTab(2);
              } else {
                notification.error({
                  message: r.msg,
                });
              }
            });
          } else if (okText.includes('完成') && tab === 2) {
            // 请求两个接口并保存
            let group = [];
            let maintainerClassrooms = [];
            Object.keys(value).forEach((item) => {
              if (item.includes('dict')) {
                group.push({
                  groupId: item.replace(/[^0-9]/gi, ''),
                  classRoomId: value[item],
                });
              }
            });
            group.forEach((every) => {
              let classRoomIds = every.classRoomId; //数组
              let everyGroup = getParentSchool(classRoomIds, dict);
              everyGroup.forEach((item) => {
                item.maintainerId = maintainerId;
                item.groupId = every.groupId;
              });
              maintainerClassrooms = [...maintainerClassrooms, ...everyGroup];
            });

            let classP = {};
            let typeP = {};
            maintainerClassrooms.forEach((item, index) => {
              classP[`maintainerClassrooms[${index}].maintainerId`] = item.maintainerId;
              classP[`maintainerClassrooms[${index}].groupId`] = item.groupId;
              classP[`maintainerClassrooms[${index}].classroomId`] = item.classroomId;
              classP[`maintainerClassrooms[${index}].schoolId`] = item.schoolId;
            });
            maintainerTypeBrands.forEach((item, index) => {
              typeP[`maintainerTypeBrands[${index}].maintainerId`] = item.maintainerId;
              typeP[`maintainerTypeBrands[${index}].groupId`] = item.groupId;
              typeP[`maintainerTypeBrands[${index}].brandId`] = item.brandId;
              typeP[`maintainerTypeBrands[${index}].typeId`] = item.typeId;
            });
            classP.id = editInfo.id;
            typeP.id = editInfo.id;
            //  保存 教室信息和类型品牌信息
            let r1 = await saveDict(classP);
            let r2 = await saveTypeBrands(typeP);
            if (r1.code === 0 && r2.code === 0) {
              notification.success({
                message: r1.msg,
              });
              getTable();
              onModalCancel();
            } else {
              notification.error({
                message: r1.msg || r2.msg,
              });
            }
          } else {
            firstStep(params).then((r) => {
              if (r.code === 0) {
                notification.success({
                  message: r.msg,
                });
                getTable();
                onModalCancel();
              } else {
                notification.error({
                  message: r.msg,
                });
              }
            });
          }
        }
      })
      .catch(() => {});
  };
  // 获取维修人员列表
  const [account, setAccount] = useState([]);
  const [maintainType, setType] = useState([]);
  const [dict, setDict] = useState([]);
  useEffect(() => {
    getMaintainType().then((r) => {
      if (r.code === 0) {
        setType(r.data);
      }
    });
    //  选择区域
    getDeviceConfigTree().then((r) => {
      if (r.code === 0) {
        setDict(formatTreeSelect(r.data));
      }
    });
    //   账号
    getMaintainer().then((r) => {
      if (r.code === 0) {
        setAccount(r.data);
      }
    });
  }, []);
  const formValueChange = (changedValues, allValues) => {
    if (allValues['dict.id']) {
      if (
        maintainType.find((item) => item.id === allValues['dict.id']).name.includes('区域') &&
        tab === 1
      ) {
        setOkText('下一步');
      } else setOkText('完成');
    }
    let info;
    if (allValues['user.id']) {
      info = account.find((item) => item.id === allValues['user.id']);
    }
    if (!allValues.name) {
      form.setFieldsValue({
        name: info.name,
      });
    }
    if (!allValues.phone) {
      form.setFieldsValue({
        phone: info.phone,
      });
    }
  };
  const onClickChoose = (id) => {
    setCurGroup(id);
    setChooseV(true);
  };
  const [group, setGroup] = useState([1]);
  const [curGroup, setCurGroup] = useState('');

  useEffect(() => {
    form.setFieldsValue({ [`combineName${curGroup}`]: info[`combineName${curGroup}`] });
  }, [info]);
  const [tab, setTab] = useState(1);
  const [okText, setOkText] = useState('完成');
  useEffect(() => {
    if (tab === 2) {
      setOkText('完成');
    }
  }, [tab]);
  const tProps = {
    treeCheckable: true,
    showCheckedStrategy: 'SHOW_PARENT',
  };
  const Choose = ({ id }) => {
    return (
      <div>
        <div className={styles.icons}>
          <img
            onClick={() => setGroup([...group, group.length + 1])}
            src={require('../../../assets/images/plus.png')}
            alt="plus"
          />
          {id !== 0 && (
            <img
              onClick={() => setGroup(group.slice(0, group.length - 1))}
              src={require('../../../assets/images/delete.png')}
              alt="delete"
            />
          )}
        </div>
        <div>
          <Form.Item
            name={`dict${id}`}
            label="选择区域"
            rules={[{ required: true, message: '请选择区域！' }]}
          >
            <TreeSelect {...tProps} treeData={dict} />
          </Form.Item>
          <Form.Item label="类别">
            <Form.Item
              noStyle
              name={`combineName${id}`}
              rules={[{ required: true, message: '请添加类别！' }]}
            >
              <Input disabled style={w250} />
            </Form.Item>
            <Button className="shadowBtn" onClick={() => onClickChoose(id)}>
              添加
            </Button>
          </Form.Item>
          <Divider />
        </div>
      </div>
    );
  };

  const modalProps = {
    chooseV,
    setChooseV,
    setInfo,
    curGroup,
    maintainerTypeBrands,
    setTypeBrands,
    maintainerId,
  };
  return (
    <BaseModal
      okText={okText}
      onOk={onModalOk}
      title={modalTitle}
      visible={modalV}
      onCancel={onModalCancel}
    >
      <ChooseType {...modalProps} />
      <Form onValuesChange={formValueChange} form={form} {...roleLayout} className="mt1">
        {tab === 1 ? (
          <>
            <Form.Item name="user.id" label="人员账号">
              <Select showSearch placeholder="选择账号">
                {account.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.account}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名！' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="电话">
              <Input maxLength={11} />
            </Form.Item>
            <Form.Item name="dict.id" label="负责设备">
              <Radio.Group>
                {maintainType.map((item) => (
                  <Radio key={item.id} value={item.id}>
                    {item.name}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </>
        ) : null}
        {tab === 2 ? (
          <>
            {group.map((item, index) => (
              <Choose key={item} id={index} />
            ))}
          </>
        ) : null}
      </Form>
    </BaseModal>
  );
};
export default MaintainModal;
