import {
  CheckSquareOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  FooterToolbar,
  ModalForm,
  ProCard,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import {
  Col,
  ConfigProvider,
  Form,
  Modal,
  Row,
  Upload,
  message,
  notification,
} from "antd";
import "styles/reset.scss";
import { isMobile } from "react-device-detect";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import {
  callCreatePost,
  callUpdatePost,
  callUploadSingleFile,
} from "@/config/api";
import { IPost } from "@/types/backend";
import { v4 as uuidv4 } from "uuid";
import enUS from "antd/lib/locale/en_US";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  dataInit?: IPost | null;
  setDataInit: (v: any) => void;
  reloadTable: () => void;
}

interface IPostForm {
  title: string;
  description: string;
  content: string;
}

interface IPostLogo {
  name: string;
  uid: string;
}

const ModalPost = (props: IProps) => {
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

  //modal animation
  const [animation, setAnimation] = useState<string>("open");

  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [dataLogo, setDataLogo] = useState<IPostLogo[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [content, setContent] = useState<string>("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (dataInit?._id && dataInit?.content) {
      setContent(dataInit.content);
    }
  }, [dataInit]);
  const submitPost = async (valuesForm: IPostForm) => {
    const { title, description } = valuesForm;

    if (dataLogo.length === 0) {
      message.error("Vui lòng tải lên ảnh bài viết");
      return;
    }

    if (dataInit?._id) {
      //update
      const res = await callUpdatePost(
        dataInit._id,
        title,
        description,
        content,
        dataLogo[0].name
      );
      if (res.data) {
        message.success("Cập nhật bài viết thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    } else {
      //create
      console.log({ title, description, content, isActive: true });
      const res = await callCreatePost(
        title,
        description,
        content,
        dataLogo[0].name
      );
      if (res.data) {
        message.success("Thêm mới bài viết thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
  };

  const handleReset = async () => {
    form.resetFields();
    setContent("");
    setDataInit(null);

    //add animation when closing modal
    setAnimation("close");
    await new Promise((r) => setTimeout(r, 400));
    setOpenModal(false);
    setAnimation("open");
  };

  const handleRemoveFile = (file: any) => {
    setDataLogo([]);
  };

  const handlePreview = async (file: any) => {
    if (!file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
      return;
    }
    getBase64(file.originFileObj, (url: string) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Ảnh tải lên phải có định dạng JPG hoặc PNG");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Dung lượng ảnh không được quá 2MB");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setLoadingUpload(true);
    }
    if (info.file.status === "done") {
      setLoadingUpload(false);
    }
    if (info.file.status === "error") {
      setLoadingUpload(false);
      message.error(
        info?.file?.error?.event?.message ??
          "Đã có lỗi xảy ra khi tải tài liệu."
      );
    }
  };

  const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
    const res = await callUploadSingleFile(file, "post");
    if (res && res.data) {
      setDataLogo([
        {
          name: res.data.fileName,
          uid: uuidv4(),
        },
      ]);
      if (onSuccess) onSuccess("ok");
    } else {
      if (onError) {
        setDataLogo([]);
        const error = new Error(res.message);
        onError({ event: error });
      }
    }
  };

  return (
    <>
      {openModal && (
        <>
          <ModalForm
            title={
              <>{dataInit?._id ? "Cập nhật bài viết" : "Tạo mới bài viết"}</>
            }
            open={openModal}
            modalProps={{
              onCancel: () => {
                handleReset();
              },
              afterClose: () => handleReset(),
              destroyOnClose: true,
              width: isMobile ? "100%" : 900,
              footer: null,
              keyboard: false,
              maskClosable: false,
              className: `modal-post ${animation}`,
              rootClassName: `modal-post-root ${animation}`,
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            onFinish={submitPost}
            initialValues={dataInit?._id ? dataInit : {}}
            submitter={{
              render: (_: any, dom: any) => (
                <FooterToolbar>{dom}</FooterToolbar>
              ),
              submitButtonProps: {
                icon: <CheckSquareOutlined />,
              },
              searchConfig: {
                resetText: "Hủy",
                submitText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
              },
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <ProFormText
                  label="Tên bài viết"
                  name="title"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên bài viết" },
                  ]}
                  placeholder="Nhập tên bài viết"
                />
              </Col>
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Ảnh"
                  name="image"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng tải lên ảnh / ảnh phải đúng định dạng",
                      validator: () => {
                        if (dataLogo.length > 0) return Promise.resolve();
                        else return Promise.reject(false);
                      },
                    },
                  ]}
                >
                  <ConfigProvider locale={enUS}>
                    <Upload
                      name="image"
                      listType="picture-card"
                      className="avatar-uploader"
                      maxCount={1}
                      multiple={false}
                      customRequest={handleUploadFileLogo}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      onRemove={(file) => handleRemoveFile(file)}
                      onPreview={handlePreview}
                      defaultFileList={
                        dataInit?._id
                          ? [
                              {
                                uid: uuidv4(),
                                name: dataInit?.image ?? "",
                                status: "done",
                                url: `${
                                  import.meta.env.VITE_BACKEND_URL
                                }/images/post/${dataInit?.image}`,
                              },
                            ]
                          : []
                      }
                    >
                      <div>
                        {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </ConfigProvider>
                </Form.Item>
              </Col>

              <Col span={16}>
                <ProFormTextArea
                  label="Mô tả"
                  name="description"
                  rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                  placeholder="Nhập mô tả bài viết"
                  fieldProps={{
                    autoSize: { minRows: 4 },
                  }}
                />
              </Col>

              <ProCard
                title="Nội dung"
                // subTitle="mô tả bài viết"
                headStyle={{ color: "#d81921" }}
                style={{ marginBottom: 20 }}
                headerBordered
                size="small"
                bordered
              >
                <Col span={24}>
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                  />
                </Col>
              </ProCard>
            </Row>
          </ModalForm>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
            style={{ zIndex: 1500 }}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </>
      )}
    </>
  );
};

export default ModalPost;
