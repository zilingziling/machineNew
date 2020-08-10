import React, { useEffect, useState } from 'react';
import styles from '../../assets.less';
import {
  Form,
  Input,
  notification,
  Radio,
  Table,
  Select,
  Upload,
  Button,
  Checkbox,
  TreeSelect,
} from 'antd';
import BaseModal from '@/components/baseModal';
import { getAssetsTable } from '@/service/assetsManage';
import { getDeviceConfigTree } from '@/service/device';
import { formatTreeSelect, getParentSchool } from '@/utils/func';
import { layout } from '@/utils/common';
const { Option } = Select;
const AssetsTable = ({ modalV, setModalV, selectInfo, setSelectInfo }) => {
  const [tableData, setTable] = useState([]);
  const [dict, setDict] = useState([]);
  const [classrooms, setCLassrooms] = useState([]);
  useEffect(() => {
    getDeviceConfigTree().then(r => {
      if (r.code === 0) {
        setDict(formatTreeSelect(r.data));
      }
    });
  }, []);
  const onModalCancel = () => {
    setModalV(false);
    form.resetFields();
  };
  const onModalOk = () => {};
  const columns = [
    {
      title: '资产编号',
      dataIndex: 'number',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '位置',
      dataIndex: 'position',
    },
    {
      title: '操作',
      render: (text, record) => (
        <a
          href="#!"
          className="opeA"
          onClick={() => {
            setSelectInfo(record);
            setModalV(false);
          }}
        >
          选择
        </a>
      ),
    },
  ];
  const [form] = Form.useForm();
  const tProps = {
    treeCheckable: true,
    showCheckedStrategy: 'SHOW_PARENT',
  };
  const onSearch = () => {
    let classRoom = form.getFieldsValue(['classroomId']).classroomId;
    if (classRoom && classRoom.length) {
      let params = [];
      let arr = getParentSchool(classRoom, dict);
      arr.forEach(i => params.push(i.classroomId));
      getAssetsTable({ classroomId: params }).then(r => {
        if (r.code === 0) {
          if (r.data.length) {
            setTable(r.data);
          }
        }
      });
    }
  };
  return (
    <BaseModal
      width={700}
      className={styles.assets}
      onOk={onModalOk}
      title="资产选择"
      visible={modalV}
      onCancel={onModalCancel}
    >
      <Form form={form}>
        <Form.Item name="classroomId">
          <TreeSelect
            placeholder="选择学校"
            {...tProps}
            treeData={dict}
            className={styles.treeSelect}
          />
        </Form.Item>
      </Form>
      <Button className={`shadowBtn ${styles.fr}`} onClick={onSearch}>
        查询
      </Button>
      <Table
        rowKey="id"
        dataSource={tableData}
        className="normalTable fixHeight"
        columns={columns}
        scroll={{ y: 300 }}
        pagination={false}
      />
    </BaseModal>
  );
};
export default AssetsTable;
