import { Button, Col, Form, Input, Modal, Row, Select, Table, Tabs, Tag, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IResume } from "@/types/backend";
import { useState, useEffect } from 'react';
import { callFetchResumeByUser, callFetchUser, callGetSubscriberSkills, callUpdateSubscriber, callUpdateUser } from "@/config/api";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { MonitorOutlined } from "@ant-design/icons";
import { SKILLS_LIST } from "@/config/utils";
import { useAppSelector } from "@/redux/hooks";
import FormList from "antd/es/form/FormList";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const UserResume = (props: any) => {
    const [listCV, setListCV] = useState<IResume[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchResumeByUser();
            if (res && res.data) {
                setListCV(res.data as IResume[])
            }
            setIsFetching(false);
        }
        init();
    }, [])

    const columns: ColumnsType<IResume> = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1)}
                    </>)
            }
        },
        {
            title: 'Công Ty',
            dataIndex: ["companyId", "name"],

        },
        {
            title: 'Vị trí',
            dataIndex: ["jobId", "name"],

        },
        // {
        //     title: 'Trạng thái',
        //     dataIndex: "status",
        // },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            sorter: true,
            render: (text, record, index) => {
                if (record.history && record.history.length > 0) {
                    const latestHistory = record.history[record.history.length - 1];
                    let color = '';
                    switch (latestHistory.status) {
                        case 'PENDING':
                            color = 'blue';
                            break;
                        case 'REVIEWING':
                            color = 'orange';
                            break;
                        case 'APPROVED':
                            color = 'green';
                            break;
                        case 'REJECTED':
                            color = 'red';
                            break;
                        default:
                            color = 'default';
                    }
                    return latestHistory.status ? <Tag color={color}>{latestHistory.status}</Tag> : null;
                } else {
                    return null;
                }
            },
        },
        {
            title: 'Ngày ứng tuyển',
            dataIndex: "createdAt",
            render(value, record, index) {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
        },
        {
            title: 'Xem CV',
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/images/resume/${record?.url}`}
                        target="_blank"
                    >xem</a>
                )
            },
        },
    ];

    return (
        <div>
            <Table<IResume>
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
            />
        </div>
    )
}

const UserUpdateInfo = () => {
    const [form] = Form.useForm();
    const user = useAppSelector(state => state.account.user);

    useEffect(() => {
        const init = async () => {
            try {
                if (user?._id) { // Kiểm tra xem user đã được định nghĩa hay chưa
                    const res = await callFetchUser(user._id); // Truyền user._id cho hàm callFetchUser
                    if (res && res.data) {
                        form.setFieldsValue(res.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        init();
    }, [form, user]);

    const onFinish = async (values: any) => {
        try {
            // Loại bỏ trường password khỏi dữ liệu gửi đi
            delete values.password;
            delete values.company;
             // Thêm trường _id vào dữ liệu gửi đi
            values._id = user?._id;
            const res = await callUpdateUser(values); // Gửi thông tin cập nhật lên server
            if (res.data) {
                message.success("Cập nhật thông tin thành công");
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    }

    const onCancel = () => {// Hủy bỏ
        form.resetFields(); // Reset form fields
        // Thực hiện hành động khác nếu cần
    }

    return (
        <div>
            <Form
                form={form}
                onFinish={onFinish}
                initialValues={user} // Khai báo giá trị mặc định cho form
            >
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Form.Item
                            label={"Tên"}
                            name={"name"}
                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                        >
                            <Input placeholder="Nhập tên"/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={"Email"}
                            name={"email"}
                            // rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label={"Tuổi"}
                            name={"age"}
                            rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
                            >
                            <Input placeholder="Nhập tuổi" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Giới Tính"
                            name="gender"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                        >
                            <Select placeholder="Chọn giới tính">
                                <Select.Option value="male">Nam</Select.Option>
                                <Select.Option value="female">Nữ</Select.Option>
                                <Select.Option value="other">Khác</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                        >
                        <Input placeholder="Nhập địa chỉ"/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button htmlType="submit">Cập nhật</Button>
                        {/* <Button onClick={onCancel} style={{ marginLeft: '1rem' }}>Hủy bỏ</Button> */}
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

const JobByEmail = (props: any) => {
    const [form] = Form.useForm();
    const user = useAppSelector(state => state.account.user);

    useEffect(() => {
        const init = async () => {
            const res = await callGetSubscriberSkills();
            if (res && res.data) {
                form.setFieldValue("skills", res.data.skills);
            }
        }
        init();
    }, [])

    const onFinish = async (values: any) => {
        const { skills } = values;
        const res = await callUpdateSubscriber({
            email: user.email,
            name: user.name,
            skills: skills ? skills : []
        });
        if (res.data) {
            message.success("Cập nhật thông tin thành công");
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }

    }

    return (
        <>
            <Form
                onFinish={onFinish}
                form={form}
            >
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Form.Item
                            label={"Kỹ năng"}
                            name={"skills"}
                            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}

                        >
                            <Select
                                mode="multiple"
                                allowClear
                                showArrow={false}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <MonitorOutlined /> Tìm theo kỹ năng...
                                    </>
                                }
                                optionLabelProp="label"
                                options={SKILLS_LIST}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button onClick={() => form.submit()}>Cập nhật</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'user-resume',
            label: `Danh sách CV đã ứng tuyển`,
            children: <UserResume />,
        },
        {
            key: 'email-by-skills',
            label: `Nhận thông báo việc làm qua email`,
            children: <JobByEmail />,
        },
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo />,
        },
        // {
        //     key: 'user-password',
        //     label: `Thay đổi mật khẩu`,
        //     children: `//todo`,
        // },
    ];


    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "1000px"}
            >

                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey="user-resume"
                        items={items}
                        onChange={onChange}
                    />
                </div>

            </Modal>
        </>
    )
}

export default ManageAccount;