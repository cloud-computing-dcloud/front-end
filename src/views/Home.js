import React from "react";
import {
  Button,
  Modal,
  Input,
  Upload,
  message,
  Popconfirm,
  Dropdown,
  Menu,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import request from "axios";

/**
 * 主页
 */
class App extends React.Component {
  clickCount = 0;

  constructor(props) {
    super(props);
    this.state = {
      curMenuIndex: -1,
      curDirectory: "/",
      files: [],
      newFolderModalVisible: false,
      newFolderModalLoading: false,
      newFolderName: "",
      uploadModalVisible: false,
      uploadModalLoading: false,
      uploadFileList: [],
    };
    if (sessionStorage.getItem("user") === null) {
      this.props.history.replace("/login");
    }
    this.getMyFiles();
  }

  //获取文件夹与列表
  getMyFiles = () => {
    request
      .get("/folders", {
        curDirectory: this.state.curDirectory,
      })
      .then((response) => {
        console.log(response.data.value);
        this.setState({
          files: response.data.value,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //创建文件夹
  createNewFolder = () => {
    if (this.state.newFolderName === "") {
      this.inputNewFolderName.focus();
      return;
    }
    this.setState({ newFolderModalLoading: true });
    request
      .post("/folders/{newFolderName}/create", {
        newFolderName: this.state.newFolderName,
      })
      .then((response) => {
        message.success("Create success");
        this.setState({
          curMenuIndex: -1,
          newFolderModalVisible: false,
          newFolderModalLoading: false,
        });
        this.getMyFiles();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //上传
  uploadDo = () => {
    if (this.state.uploadFileList.length === 0) {
      message.warn("Please select the file you want to upload first!");
      return;
    }
    message.success("Upload success");
    this.setState({
      curMenuIndex: -1,
      uploadModalVisible: false,
      uploadModalLoading: false,
      uploadFileList: [],
    });
    this.getMyFiles();
  };

  //删除
  delete = (file) => {
    request
      .post("/api/delete", {
        curDirectory: this.state.curDirectory,
        file,
      })
      .then((response) => {
        message.success("Delete success");
        this.getMyFiles();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //退出
  logout = () => {
    sessionStorage.removeItem("user");
    this.props.history.replace("/");
  };

  render() {
    return (
      <div className={"homeApp"}>
        <div className={"leftMenu"}>
          <div>
            <Button
              type={this.state.curMenuIndex === 0 ? "primary" : "default"}
              onClick={(event) => {
                this.setState({
                  curMenuIndex: 0,
                  newFolderModalVisible: true,
                });
              }}
            >
              New Folder
            </Button>
            <Button
              type={this.state.curMenuIndex === 1 ? "primary" : "default"}
              onClick={(event) => {
                this.setState({
                  curMenuIndex: 1,
                  uploadModalVisible: true,
                });
              }}
            >
              Upload
            </Button>
            <Button
              type={this.state.curMenuIndex === 3 ? "primary" : "default"}
              onClick={(event) => {
                message.info("To be developed");
              }}
            >
              Drive Setting
            </Button>
          </div>
          <br />
          <br />
          <br />
          <img
            src={require("../assets/recycleBin.png").default}
            alt={""}
            onClick={(event) => {
              message.info("To be developed");
            }}
          />
        </div>
        <div className={"rightContent"}>
          <div className={"head"}>
            My Drive
            <div>
              <Button
                type={"primary"}
                onClick={(event) => {
                  message.info("To be developed");
                }}
              >
                Share drive
              </Button>
              &nbsp;&nbsp;
              <Popconfirm
                title="Are you sure to logout?"
                onConfirm={(e) => {
                  this.logout();
                }}
              >
                <Button type={"danger"}>Logout</Button>
              </Popconfirm>
            </div>
          </div>
          <div className={"body"}>
            <div className={"curDirectory"}>
              Current directory: {this.state.curDirectory}
              {this.state.curDirectory !== "/" && (
                <img
                  className={"return"}
                  src={require("../assets/return.png").default}
                  alt={""}
                  onClick={() => {
                    this.setState(
                      {
                        curDirectory: this.state.curDirectory.substring(
                          0,
                          this.state.curDirectory.lastIndexOf("/") + 1
                        ),
                      },
                      function () {
                        this.getMyFiles();
                      }
                    );
                  }}
                />
              )}
            </div>
            <div className={"folderFilePanel"}>
              {this.state.files.map((file, index) => (
                <Dropdown
                  key={index}
                  placement="bottomCenter"
                  trigger={["click"]}
                  overlay={
                    <Menu>
                      <Menu.Item
                        key={"delete"}
                        onClick={() => {
                          this.delete(file.name);
                        }}
                      >
                        Delete
                      </Menu.Item>
                      {file.type === "file" && (
                        <Menu.Item key={"download"}>
                          <a
                            href={
                              "/files" + this.state.curDirectory + file.name
                            }
                          >
                            Download
                          </a>
                        </Menu.Item>
                      )}
                    </Menu>
                  }
                >
                  <Button
                    type={"link"}
                    onClick={(event) => {
                      this.clickCount += 1;
                      setTimeout(() => {
                        if (this.clickCount === 2) {
                          if (file.type === "directory") {
                            this.setState(
                              {
                                curDirectory: file.directory,
                              },
                              function () {
                                this.getMyFiles();
                              }
                            );
                          }
                        }
                        this.clickCount = 0;
                      }, 300);
                    }}
                  >
                    <img
                      src={require("../assets/" + file.type + ".png").default}
                      alt={""}
                    />
                    {file.name}
                  </Button>
                </Dropdown>
              ))}
            </div>
          </div>
        </div>

        <Modal
          title={"New Folder"}
          visible={this.state.newFolderModalVisible}
          confirmLoading={this.state.newFolderModalLoading}
          onOk={(e) => {
            this.createNewFolder();
          }}
          onCancel={(e) => {
            this.setState({
              newFolderModalVisible: false,
              newFolderModalLoading: false,
            });
          }}
          centered={true}
          width={"300px"}
        >
          <Input
            value={this.state.newFolderName}
            maxLength={20}
            ref={(input) => {
              this.inputNewFolderName = input;
            }}
            onChange={(event) => {
              this.setState({ newFolderName: event.target.value });
            }}
          />
          <br />
          <div className={"warmMesg"}>Do not include special characters</div>
        </Modal>
        <Modal
          title={"Upload"}
          visible={this.state.uploadModalVisible}
          confirmLoading={this.state.uploadModalLoading}
          onOk={(e) => {
            this.uploadDo();
          }}
          onCancel={(e) => {
            this.setState({
              uploadModalVisible: false,
              uploadModalLoading: false,
              uploadFileList: [],
            });
          }}
          centered={true}
          width={"300px"}
        >
          <Upload
            name={"file"}
            action="/file/upload"
            multiple={true}
            fileList={this.state.uploadFileList}
            onChange={(info) => {
              this.setState({ uploadFileList: info.fileList });
            }}
          >
            <Button icon={<UploadOutlined />}>Click upload</Button>
          </Upload>
        </Modal>
      </div>
    );
  }
}

export default App;
