import React, { useEffect, useState } from 'react';
import styles from './login.less';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Form, notification } from 'antd';
import { getMenus, login } from '@/service/login';
import SparkMd5 from 'spark-md5';
import { history } from 'umi';
import { webSocket } from '@/utils/websocket';
import { connect } from 'dva';
import { resizeListener } from '@/utils/func';
const Login = ({}) => {
  const [form] = Form.useForm();
  const [authCode, setCode] = useState('');
  useEffect(() => {
    getCode();
    window.addEventListener('resize', resizeListener);
    resizeListener();
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);
  const getCode = () => {
    const number = Math.floor(Math.random() * 10000);
    let code = 'integrated/identifyingCode?' + parseInt(number);
    setCode(code);
    form.setFieldsValue({ code: '' });
  };
  const onLogin = () => {
    form
      .validateFields()
      .then(value => {
        if (value) {
          let params = value;
          params.password = SparkMd5.hash(params.password);
          login(params).then(r => {
            if (r.code === 0) {
              webSocket();
              history.push('/');
              window.localStorage.setItem('token', r.data.token);
              window.localStorage.setItem('account', params.account);
              setTimeout(() => {
                notification.success({
                  message: '登陆成功',
                  description: `欢迎你！${window.localStorage.getItem('account') || ''}`,
                });
              }, 1000);
              form.resetFields();
            }
          });
        }
      })
      .catch(error => {});
  };
  return (
    <div className={styles.loginWrapper}>
      <h1>弈简运维管控平台</h1>
      <div className={styles.login}>
        <h6>用户登录</h6>
        <div className={styles.loginForm}>
          <Form form={form} className={styles.form}>
            <Form.Item name="account" rules={[{ required: true, message: '请输入账号！' }]}>
              <Input
                maxLength={20}
                placeholder="请输入账号"
                prefix={
                  <img className={styles.icon} src={require('../../../assets/images/user.png')} />
                }
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
              <Input.Password
                placeholder="请输入用户密码"
                prefix={
                  <img className={styles.icon} src={require('../../../assets/images/pass.png')} />
                }
              />
            </Form.Item>
            <Form.Item className={styles.flex}>
              <Form.Item
                name="code"
                noStyle
                rules={[{ required: true, message: '请输入验证码！' }]}
              >
                <Input
                  className={styles.vertify}
                  placeholder="请输入验证码"
                  maxLength={4}
                  prefix={
                    <img
                      className={styles.icon}
                      src={require('../../../assets/images/vertify.png')}
                    />
                  }
                />
              </Form.Item>
              <img className={styles.vertifyImg} src={authCode} onClick={getCode} />
            </Form.Item>

            <Form.Item>
              <Button onClick={onLogin} type="primary" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default connect(({ global }) => ({
  moreMenu: global.moreMenu,
}))(Login);
