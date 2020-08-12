import React, { useEffect, useState } from 'react';
import styles from '../../assets.less';
import { Form, Input, notification, Radio, Card, Select, Upload, Button, Checkbox } from 'antd';
import { layout, roleLayout } from '../../../../utils/common';
import { add_edit } from '@/service/device';
import BaseModal from '@/components/baseModal';
import { UploadOutlined } from '@ant-design/icons';
import { repairLayout, wideLayout } from '@/utils/common';
import AssetsTable from '@/pages/assetsManage/repairs/components/assetsTable';
import {
  addRepair,
  getMaintainSelect,
  getRepairProgress,
  getRepairReasons,
} from '@/service/assetsManage';
import DescriptionTable from '@/pages/assetsManage/repairs/components/description';
import FirmTable from '@/pages/assetsManage/repairs/components/firm';
const { Option } = Select;
const OpeModal = ({ modalTitle, modalV, setModalV, getTable, editInfo, process, maintainer }) => {
  const [form] = Form.useForm();
  const [reason, setReason] = useState([]);

  const onModalCancel = () => {
    setModalV(false);
    form.resetFields();
  };
  useEffect(() => {
    getRepairReasons().then(r => {
      if (r.code === 0) {
        setReason(r.data);
      }
    });
  }, []);
  //  编辑回显
  useEffect(() => {
    if (Object.keys(editInfo).length && modalTitle.includes('编辑')) {
      form.setFieldsValue({
        assetsId: editInfo.assetsNumber,
        'reason.id': editInfo.reasonId,
        content: editInfo.content,
        repairUser: editInfo.repairUser,
        maintainerId: editInfo.maintainerId,
        repairUserPhone: editInfo.repairUserPhone,
        maintainerPhone: editInfo.maintainerPhone,
        cost: editInfo.cost,
        processId: editInfo.processId,
        repairWay: editInfo.repairWay,
        'progress.id': editInfo.processId,
      });
      if (editInfo.manufacturerId) {
        setCheckedFirm(true);
        setSelectFirmInfo({
          name: editInfo.manufacturer,
          id: editInfo.manufacturerId,
          phone: editInfo.manufacturerPhone,
          content: editInfo.manufacturerContent,
        });
      }
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
          params.number = selectInfo.number || '';
          params.file = tempImg;
          params.manufacturerId = selectFirmInfo.id;
          params.assetsId = selectInfo.id;
          addRepair(params).then(r => {
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
  useEffect(() => {
    form.setFieldsValue({
      content: selectDes,
    });
  }, [selectDes]);
  // 图片上传
  const [tempImg, setTempImg] = useState('');
  const onUpload = e => {
    if (e.file.status === 'done') {
      if (e.file.response.code === 0) {
        form.setFieldsValue({
          imageUrl: e.file.response.data,
        });
        setTempImg(e.file.response.data);
        notification.success({
          message: e.file.response.msg,
        });
      } else {
        notification.error({
          message: e.file.response.msg,
        });
      }
    }
  };
  // 厂商选择
  const [firmV, setFirmV] = useState(false);
  const [selectFirmInfo, setSelectFirmInfo] = useState({
    name: '',
    id: '',
    phone: '',
    content: '',
  });
  const [checkedFirm, setCheckedFirm] = useState(false);
  const onClickFirm = e => {
    setCheckedFirm(e.target.checked);
    if (e.target.checked) {
      setFirmV(true);
    }
  };
  const firmProps = {
    firmV,
    setFirmV,
    setSelectFirmInfo,
  };
  return (
    <BaseModal onOk={onModalOk} title={modalTitle} visible={modalV} onCancel={onModalCancel}>
      <AssetsTable {...assetsTableProps} />
      <DescriptionTable {...desProps} />
      <FirmTable {...firmProps} />
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
          <Card style={{ marginBottom: '1rem' }} className={styles.infoCard}>
            <section>
              <div>
                <p>名称：{editInfo.name}</p>
                <p>维修单号：{editInfo.repairNumber}</p>
              </div>
              <div>
                <p>位置：{editInfo.position}</p>
                <p>报修时间：{editInfo.repairTime}</p>
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
        <Form.Item label="详细描述">
          <Form.Item name="content" noStyle>
            <Input.TextArea style={inputWidth}></Input.TextArea>
          </Form.Item>
          <span className={styles.green} onClick={() => setDesV(true)}>
            历史
          </span>
        </Form.Item>
        <Form.Item label="图标">
          {tempImg || editInfo.imageUrl ? (
            <Form.Item noStyle name="imageUrl">
              <img className="iconStyle" src={tempImg || editInfo.file || ''} />
            </Form.Item>
          ) : null}
          <Upload
            name="file"
            onChange={onUpload}
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
            {process.map(item => (
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
            <Select style={{ width: 150 }}>
              {maintainer.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="maintainerPhone" label="电话" labelCol={4}>
            <Input style={{ width: 140 }} />
          </Form.Item>
          <Form.Item wrapperCol={2}>
            <Checkbox onChange={onClickFirm} className={styles.green}>
              厂商
            </Checkbox>
          </Form.Item>
        </div>
        {checkedFirm && selectFirmInfo.id ? (
          <Card className={styles.infoCard}>
            <section>
              <div>
                <p>厂商：{selectFirmInfo.name}</p>
                <p>电话：{selectFirmInfo.phone}</p>
              </div>
              <div>
                <p>说明：{selectFirmInfo.content}</p>
              </div>
            </section>
          </Card>
        ) : null}
      </Form>
    </BaseModal>
  );
};
export default OpeModal;
const inputWidth = { width: '80%', resize: 'none' };
