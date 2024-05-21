import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IResume } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { Button, Popconfirm, Select, Space, Tag, message, notification } from "antd";
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { callDeleteResume } from "@/config/api";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";
import { fetchResume } from "@/redux/slice/resumeSlide";
import ViewDetailResume from "@/components/admin/resume/view.resume";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";

const ResumePage = () => {
    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.resume.isFetching);
    const meta = useAppSelector(state => state.resume.meta);
    const resumes = useAppSelector(state => state.resume.result);
    const dispatch = useAppDispatch();

    const [dataInit, setDataInit] = useState<IResume | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const handleDeleteResume = async (_id: string | undefined) => {
        if (_id) {
            const res = await callDeleteResume(_id);
            if (res && res.data) {
                message.success('Xóa Resume thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }
    /// filter status
    const processData = (resumes: IResume[]) => {
        return resumes.map(resume => {
            if (resume.history && resume.history.length >= 2) {
                // Coppy resume
                const newResume = { ...resume };
                // Coppy history
                newResume.history = [...resume.history];
                newResume.history.shift();
                return newResume;
            }
            console.log(">>>Check resume: ", resume)
            return resume;
        });
    }


    useEffect(() => {
        if (resumes) {
            const processedData = processData(resumes);
            console.log(">>>Check processed resumes: ", processedData);
        }
    }, [resumes]);

    const columns: ProColumns<IResume>[] = [
        {
            title: 'Id',
            dataIndex: '_id',
            width: 250,
            render: (text, record, index, action) => {
                return (
                    <p  onClick={() => {
                        // setOpenViewDetail(true);
                        setDataInit(record);
                    }}>
                        {record._id}
                    </p>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'history.status',
            sorter: true,
            render: (text, record, index, action) => {
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
                    return (
                        latestHistory && latestHistory.status ? (
                          <a href="#" onClick={() => {
                            setOpenViewDetail(true);
                            setDataInit(record);
                          }}>
                            <Tag color={color}>{latestHistory.status}</Tag>
                          </a>
                        ) : null
                      );
                } else {
                    return null;
                }
            },
            renderFormItem: (item, props, form) => (
                <ProFormSelect
                    showSearch
                    mode="multiple"
                    allowClear
                    valueEnum={{
                        PENDING: 'PENDING',
                        REVIEWING: 'REVIEWING',
                        APPROVED: 'APPROVED',
                        REJECTED: 'REJECTED',
                    }}
                    placeholder="Chọn trạng thái"
                />
            ),
        },
        {
            title: 'Tên việc làm',
            dataIndex: ["jobId", "name"],
            hideInSearch: true,
        },
        {
            title: 'Tên công ty',
            dataIndex: ["companyId", "name"],
            hideInSearch: true,
        },

        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
       
        if (clone?.status?.length) {
            clone.status = clone.status.join(",");
        }
        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.status) {
            sortBy = sort.status === 'ascend' ? "sort=history.status" : "sort=-history.status";
        }

        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt" : "sort=-createdAt";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt" : "sort=-updatedAt";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=-updatedAt`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        temp += "&populate=companyId,jobId&fields=companyId._id, companyId.name, companyId.logo, jobId._id, jobId.name";
        return temp;
    }

    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.RESUMES.GET_PAGINATE}
            >
                <DataTable<IResume>
                    actionRef={tableRef}
                    headerTitle="Danh sách thư xin việc"
                    rowKey="_id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={resumes}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchResume({ query }))
                    }}
                    scroll={{ x: true }}
                    pagination={
                        {
                            current: meta.current,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: meta.total,
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} / {total} </div>) }
                        }
                    }
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <></>
                        );
                    }}
                />
            </Access>
            <ViewDetailResume
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
            />
        </div>
    )
}

export default ResumePage;
