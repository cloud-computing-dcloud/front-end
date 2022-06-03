import React from "react";
import { Form, Button, Input } from "antd";
import request from "axios";
import { API_SERVER } from "../../config/config";
import axios from "axios";

/**
 * 登录
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //提交注册
  onFinish = (values) => {
    //以下提交至登录接口
    request
      .post(`${API_SERVER}/login`, values)
      .then((response) => {
        console.log(response);
        var token = response.data.accessToken;
        sessionStorage.setItem("user", token);
        sessionStorage.setItem("root_folder", response.data.rootFolderId);

        this.props.history.replace("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className={"indexApp"}>
        <div className={"middlePanel"}>
          <div className={"title"}>D-Cloud</div>
          <br />
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default App;
