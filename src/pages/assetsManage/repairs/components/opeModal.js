import React, { useEffect, useState } from 'react';
import styles from '../../assets.less';
import { Form, Input, notification, Radio, Card, Select, Upload, Button, Checkbox } from 'antd';
import { layout, roleLayout } from '../../../../utils/common';
import { add_edit } from '@/service/device';
import BaseModal from '@/components/baseModal';
import { UploadOutlined } from '@ant-design/icons';
import { repairLayout, wideLayout } from '@/utils/common';
import AssetsTable from '@/pages/assetsManage/repairs/components/assetsTable';
import { getRepairProgress, getRepairReasons } from '@/service/assetsManage';
import DescriptionTable from '@/pages/assetsManage/repairs/components/description';
const { Option } = Select;
const OpeModal = ({ modalTitle, modalV, setModalV, getTable, editInfo }) => {
  const [form] = Form.useForm();
  const [reason, setReason] = useState([]);
  const [progress, setProgress] = useState([]);
  const onModalCancel = () => {
    setModalV(false);
  };
  useEffect(() => {
    getRepairReasons().then(r => {
      if (r.code === 0) {
        setReason(r.data);
      }
    });
    getRepairProgress().then(r => {
      if (r.code === 0) {
        setProgress(r.data);
      }
    });
  }, []);
  //  编辑回显
  useEffect(() => {
    if (Object.keys(editInfo).length && modalTitle.includes('编辑')) {
      form.setFieldsValue({
        name: editInfo.name,
        sort: editInfo.sort,
      });
    } else {
      form.resetFields();
    }
  }, [editInfo]);

  const onModalOk = () => {
    form
      .validateFields()
      .then(value => {
        if (value) {
          let params = value;
          if (modalTitle.includes('编辑')) {
            params.id = editInfo.id;
          }
          add_edit(params).then(r => {
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
  // 资产选择
  const [assetTableV, setAssetsTableV] = useState(false);
  const [selectInfo, setSelectInfo] = useState({
    number: '',
    position: '',
    name: '',
  });
  const assetsTableProps = {
    modalV: assetTableV,
    setModalV: setAssetsTableV,
    selectInfo,
    setSelectInfo,
  };
  useEffect(() => {
    form.setFieldsValue({
      assetsId: selectInfo.number,
    });
  }, [selectInfo]);
  // 历史描述列表
  const [desV, setDesV] = useState(false);
  const [selectDes, setSelectDes] = useState('');
  const desProps = {
    desV,
    setDesV,
    setSelectDes,
  };
  return (
    <BaseModal onOk={onModalOk} title={modalTitle} visible={modalV} onCancel={onModalCancel}>
      <AssetsTable {...assetsTableProps} />
      <DescriptionTable {...desProps} />
      <Form form={form} className="mt1" {...repairLayout}>
        <Form.Item label="资产编号">
          <Form.Item
            noStyle
            name="assetsId"
            rules={[{ required: true, message: '请输入资产编号！' }]}
          >
            <Input style={inputWidth} />
          </Form.Item>
          <span className={styles.green} onClick={() => setAssetsTableV(true)}>
            选择
          </span>
        </Form.Item>
        {modalTitle.includes('编辑') && (
          <Card className={styles.infoCard}>
            <section>
              <div>
                <p>名称：</p>
                <p>维修单号：</p>
              </div>
              <div>
                <p>位置：</p>
                <p>报修时间：</p>
              </div>
            </section>
          </Card>
        )}
        <Form.Item
          name="reason.id"
          label="报修原因"
          rules={[{ required: true, message: '请选择报修原因！' }]}
        >
          <Select style={inputWidth}>
            {reason.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="content" label="详细描述">
          <Form.Item noStyle>
            <Input.TextArea style={inputWidth}></Input.TextArea>
          </Form.Item>
          <span className={styles.green} onClick={() => setDesV(true)}>
            历史
          </span>
        </Form.Item>
        <Form.Item label="图标">
          {/*{tempImg || editInfo.imageUrl ? (*/}
          {/*  <Form.Item noStyle name="imageUrl">*/}
          {/*    <img className="iconStyle" src={tempImg || editInfo.imageUrl || ''} />*/}
          {/*  </Form.Item>*/}
          {/*) : null}*/}
          <Upload
            name="file"
            // onChange={onUpload}
            action="/integrated/file/upload"
            showUploadList={false}
            accept="image/png,image/jpg,image/jpeg"
          >
            {/*className={tempImg || editInfo.imageUrl ? 'mt1' : ''}*/}
            <Button>
              <UploadOutlined /> 上传附件
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item name="progress.id" label="维修进度">
          <Select style={inputWidth}>
            {progress.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="cost" label="费用">
          <Input style={inputWidth} />
        </Form.Item>
        <Form.Item name="repairWay" label="维修方式">
          <Input style={inputWidth} />
        </Form.Item>
        <div className={styles.flex}>
          <Form.Item name="repairUser" label="报修人" labelCol={4} wrapperCol={6}>
            <Input />
          </Form.Item>
          <Form.Item name="repairUserPhone" label="电话" labelCol={4} wrapperCol={6}>
            <Input />
          </Form.Item>
        </div>
        <div className={styles.flex}>
          <Form.Item name="maintainerId" label="维修人" labelCol={4}>
            <Select style={{ width: 140 }}>
              <Option value={1}>123</Option>
            </Select>
          </Form.Item>
          <Form.Item name="maintainerPhone" label="电话" labelCol={4}>
            <Input style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="manufacturerId" wrapperCol={2}>
            <Checkbox className={styles.green}>厂商</Checkbox>
          </Form.Item>
        </div>
      </Form>
    </BaseModal>
  );
};
export default OpeModal;
const inputWidth = { width: '80%' };
