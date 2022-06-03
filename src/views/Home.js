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
import { API_SERVER } from "../config/config";
import axios from "axios";

/**
 * 主页
 */
class App extends React.Component {
  clickCount = 0;

  constructor(props) {
    super(props);
    this.state = {
      curMenuIndex: -1,
      curDirectory: sessionStorage.getItem("root_folder"),
      files: JSON.stringify(["test"]),
      folders: JSON.stringify(["test"]),
      newFolderModalVisible: false,
      newFolderModalLoading: false,
      newFolderName: "",
      uploadModalVisible: false,
      uploadModalLoading: false,
      uploadFileList: [],
      sessionToken: sessionStorage.getItem("user"),
    };
    if (sessionStorage.getItem("user") === null) {
      this.props.history.replace("/login");
    }
    this.getMyFiles(this.state.curDirectory);
  }

  //获取文件夹与列表
  getMyFiles = async (folderId) => {
    await request
      .get(`${API_SERVER}/folders/${folderId}`, {
        headers: {
          Authorization: `Bearer ${this.state.sessionToken}`,
        },
      })
      .then((response) => {
        this.setState({
          curDirectory: folderId,
          files: JSON.stringify(response.data.files),
          folders: JSON.stringify(response.data.folders),
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
      .post(`${API_SERVER}/folders/${this.state.curDirectory}/create`, {
        name: this.state.newFolderName,
      },{
        headers: {
          Authorization: `Bearer ${this.state.sessionToken}`,
        },
      })
      .then((response) => {
        message.success("Create success");
        this.setState({
          curMenuIndex: -1,
          newFolderModalVisible: false,
          newFolderModalLoading: false,
        });
        this.getMyFiles(this.state.curDirectory);
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
    var file = this.state.uploadFileList[0].originFileObj;

    var form = new FormData();
    form.append("file", file);

    axios({
      method: "post",
      url: `${API_SERVER}/folders/${this.state.curDirectory}/upload`,
      data: form,
      headers: {
        "content-type": `multipart/form-data; boundary=${form._boundary}`,
        Authorization: `Bearer ${this.state.sessionToken}`,
      },
    });

    message.success("Upload success");
    this.setState({
      curMenuIndex: -1,
      uploadModalVisible: false,
      uploadModalLoading: false,
      uploadFileList: [],
    });

    this.getMyFiles(this.state.curDirectory);
  };

  downloadFile = (fileId,fileName) => {
    request
      .post(`${API_SERVER}/folders/${this.state.curDirectory}/download`, {
        fileId: fileId,
      },{
        headers: {
          Authorization: `Bearer ${this.state.sessionToken}`,
        },
      })
      .then((response) => {
        const url = response.data.downloadUrl;
        fetch(url, { method: 'GET' })
          .then((res) => {
            return res.blob() // raw 데이터를 받아온다
          })
          .then((blob) => {
            const url = window.URL.createObjectURL(blob) // 받아온 날 상태의 data를 현재 window에서만 사용하는 url로 바꾼다
            const a = document.createElement('a')
            a.href = url
            a.download =  fileName// 원하는 이름으로 파일명 지정
            document.body.appendChild(a)
            a.click() // 자동으로 눌러버리기
            setTimeout((_) => {
              window.URL.revokeObjectURL(url) // 해당 url을 더 사용 못하게 날려버린다
            }, 60000)
            a.remove() // a를 다 사용했으니 지워준다
          })
          .catch((err) => {
            console.error('err: ', err)
          })
      })
  }

  //删除
  deleteFile = (key) => {
    request
      .delete(`${API_SERVER}/folders/${this.state.curDirectory}/delete`, {
        data: { fileId: key },
        headers: {
          Authorization: `Bearer ${this.state.sessionToken}`,
        },
      })
      .then((response) => {
        message.success("Delete success");
        this.getMyFiles(this.state.curDirectory);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deleteFolder = (folderId) =>{
    request
      .delete(`${API_SERVER}/folders/${folderId}`, {
        headers: {
          Authorization: `Bearer ${this.state.sessionToken}`,
        },
      })
      .then((response) => {
        message.success("Delete success");
        this.getMyFiles(this.state.curDirectory);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //退出
  logout = () => {
    sessionStorage.removeItem("user");
    this.props.history.replace("/");
  };

  render() {
    const fileList = JSON.parse(this.state.files);
    const folderList = JSON.parse(this.state.folders);
    // console.log(fileList);
    // return fileList;

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
                        this.getMyFiles(this.state.curDirectory);
                      }
                    );
                  }}
                />
              )}
            </div>

            <div className={"folderFilePanel"}>
              {folderList.map((folder, index) => (
                <Dropdown
                  key={index}
                  placement="bottomCenter"
                  trigger={["click"]}
                  overlay={
                    <Menu>
                      <Menu.Item
                        key={"open"}
                        onClick={() => {
                          this.getMyFiles(folder.id);
                        }}
                      >
                        Open
                      </Menu.Item>
                      <Menu.Item
                        key={"delete"}
                        onClick={() => {
                          this.deleteFolder(folder.id);
                        }}
                      >
                        Delete
                      </Menu.Item>                    
                    </Menu>
                  }
                >
                  <Button
                    type={"link"}
                    onClick={(event) => {
                      this.clickCount += 1;
                      setTimeout(() => {
                        if (this.clickCount === 2) {
                          if (folder.type === "directory") {
                            this.setState(
                              {
                                curDirectory: folder.id,
                              },
                              function () {
                                this.getMyFiles(folder.id);
                              }
                            );
                          }
                        }
                        this.clickCount = 0;
                      }, 300);
                    }}
                  >
                    <div>
                      <img
                        src={require("../assets/directory.png").default}
                        alt={""}
                      />
                      {folder.name}
                    </div>
                  </Button>
                </Dropdown>
              ))}
            </div>

            <div className={"folderFilePanel"}>
              {fileList.map((file, index) => (
                <Dropdown
                  key={index}
                  placement="bottomCenter"
                  trigger={["click"]}
                  overlay={
                    <Menu>
                      <Menu.Item
                        key={"download"}
                        onClick={() => {
                          this.downloadFile(file.id,file.name);
                        }}
                      >
                          Download
                      </Menu.Item>
                      <Menu.Item
                        key={"delete"}
                        onClick={() => {
                          this.deleteFile(file.id);
                        }}
                      >
                        Delete
                      </Menu.Item>                    
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
                                this.getMyFiles(this.state.curDirectory);
                              }
                            );
                          }
                        }
                        this.clickCount = 0;
                      }, 300);
                    }}
                  >
                    <div>
                      <img
                        src={require("../assets/file.png").default}
                        alt={""}
                      />
                      {file.name}
                    </div>
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
