import React from 'react';
import styles from './login.less';
import { Form, Button, Input } from 'antd';
const Login = ({ form }) => {
  return (
    <div className={styles.loginWrapper}>
      <h1>弈简运维管控平台</h1>
      <div className={styles.login}>
        <h6>用户登录</h6>
        <div className={styles.loginForm}>
          <Form className={styles.form}>
            <Form.Item name="username" rules={[{ required: true, message: '请输入账号！' }]}>
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

            <Form.Item name="vertify" rules={[{ required: true, message: '请输入验证码！' }]}>
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
              <img className={styles.vertifyImg} src="" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
