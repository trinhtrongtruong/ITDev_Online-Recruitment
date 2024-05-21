// import ModalPost from "@/components/admin/post/modal.post";
// import DataTable from "@/components/client/data-table";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { fetchPost } from "@/redux/slice/postSlice";
// import { IPost } from "@/types/backend";
// import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
// import { ActionType, ProColumns } from '@ant-design/pro-components';
// import { Button, Popconfirm, Space, message, notification } from "antd";
// import { useState, useRef } from 'react';
// import dayjs from 'dayjs';
// import { callDeletePost } from "@/config/api";
// import queryString from 'query-string';
// import Access from "@/components/share/access";
// import { ALL_PERMISSIONS } from "@/config/permissions";
// import parse from "html-react-parser";

// const PostPage = () => {
//     const [openModal, setOpenModal] = useState<boolean>(false);
//     const [dataInit, setDataInit] = useState<IPost | null>(null);

//     const tableRef = useRef<ActionType>();

//     const isFetching = useAppSelector(state => state.post.isFetching);
//     const meta = useAppSelector(state => state.post.meta);
//     const posts = useAppSelector(state => state.post.result);
//     const user = useAppSelector(state => state.account.user);
//     const dispatch = useAppDispatch();


//     const handleDeletePost = async (_id: string | undefined) => {
//         if (_id) {
//             const res = await callDeletePost(_id);
//             if (res && res.data) {
//                 message.success('Xóa bài viết thành công');
//                 reloadTable();
//             } else {
//                 notification.error({
//                     message: 'Có lỗi xảy ra',
//                     description: res.message
//                 });
//             }
//         }
//     }

//     const reloadTable = () => {
//         tableRef?.current?.reload();
//     }

//     const truncateText = (text: string, limit: number) => {
//         const words = text.split(' ');
//         if (words.length > limit) {
//             return words.slice(0, limit).join(' ') + '...';
//         }
//         return text;
//     };

//     const columns: ProColumns<IPost>[] = [
//         {
//             title: 'STT',
//             key: 'index',
//             width: 50,
//             align: "center",
//             render: (text, record, index) => {
//                 return (
//                     <>
//                         {(index + 1) + (meta.current - 1) * (meta.pageSize)}
//                     </>)
//             },
//             hideInSearch: true,
//         },
//         {
//             title: 'Id',
//             dataIndex: '_id',
//             width: 250,
//             render: (text, record, index, action) => {
//                 return (
//                     <span>
//                         {record._id}
//                     </span>
//                 )
//             },
//             hideInSearch: true,
//         },
//         {
//             title: 'Tiêu đề',
//             dataIndex: 'title',
//             sorter: true,
//         },
//         {
//             title: 'Mô tả',
//             dataIndex: 'description',
//             sorter: true,
//             render: (text) => truncateText(text as string, 100),
//         },
//         // {
//         //     title: 'Nội dung',
//         //     dataIndex: 'content',
//         //     sorter: true,
//         //     render: (text, record, index, action) => {
//         //         return (
//         //             <>{parse(record?.content ?? "")}</>
//         //         )
//         //     },
//         // },
//         {
//             title: 'Ngày tạo',
//             dataIndex: 'createdAt',
//             width: 200,
//             sorter: true,
//             render: (text, record, index, action) => {
//                 return (
//                     <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
//                 )
//             },
//             hideInSearch: true,
//         },
//         {
//             title: 'Ngày cập nhật',
//             dataIndex: 'updatedAt',
//             width: 200,
//             sorter: true,
//             render: (text, record, index, action) => {
//                 return (
//                     <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>
//                 )
//             },
//             hideInSearch: true,
//         },
//         {

//             title: 'Hành động',
//             hideInSearch: true,
//             width: 90,
//             render: (_value, entity, _index, _action) => (
//                 <Space>
//                     <Access
//                         permission={ALL_PERMISSIONS.POSTS.UPDATE}
//                         hideChildren
//                     >


//                         <EditOutlined
//                             style={{
//                                 fontSize: 20,
//                                 color: '#ffa500',
//                             }}
//                             type=""
//                             onClick={() => {
//                                 setOpenModal(true);
//                                 setDataInit(entity);
//                             }}
//                         />
//                     </Access>
//                     <Access
//                         permission={ALL_PERMISSIONS.POSTS.DELETE}
//                         hideChildren
//                     >
//                         <Popconfirm
//                             placement="leftTop"
//                             title={"Xác nhận xóa bài viết"}
//                             description={"Bạn có chắc chắn muốn xóa bài viết này ?"}
//                             onConfirm={() => handleDeletePost(entity._id)}
//                             okText="Xác nhận"
//                             cancelText="Hủy"
//                         >
//                             <span style={{ cursor: "pointer", margin: "0 10px" }}>
//                                 <DeleteOutlined
//                                     style={{
//                                         fontSize: 20,
//                                         color: '#ff4d4f',
//                                     }}
//                                 />
//                             </span>
//                         </Popconfirm>
//                     </Access>
//                 </Space>
//             ),

//         },
//     ];

//     const buildQuery = (params: any, sort: any, filter: any,  user: any) => {
//         const clone = { ...params };
//         if (clone.title) clone.title = `/${clone.title}/i`;
//         if (clone.description) clone.description = `/${clone.description}/i`;

//         let temp = queryString.stringify(clone);

//         let sortBy = "";
//         if (sort && sort.title) {
//             sortBy = sort.title === 'ascend' ? "sort=title" : "sort=-title";
//         }
//         if (sort && sort.description) {
//             sortBy = sort.description === 'ascend' ? "sort=description" : "sort=-description";
//         }
//         if (sort && sort.createdAt) {
//             sortBy = sort.createdAt === 'ascend' ? "sort=createdAt" : "sort=-createdAt";
//         }
//         if (sort && sort.updatedAt) {
//             sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt" : "sort=-updatedAt";
//         }

//         //mặc định sort theo updatedAt
//         if (Object.keys(sortBy).length === 0) {
//             temp = `${temp}&sort=-updatedAt`;
//         } else {
//             temp = `${temp}&${sortBy}`;
//         }
//         // Thêm điều kiện để chỉ lấy các bài viết mà người dùng có quyền xem
//         if (user?.post?._id) {
//             temp = `${temp}&post._id=${user.post._id}`;
//         }

//         return temp;
//     }

//     return (
//         <div>
//             <Access
//                 permission={ALL_PERMISSIONS.POSTS.GET_PAGINATE}
//             >
//                 <DataTable<IPost>
//                     actionRef={tableRef}
//                     headerTitle="Danh sách bài viết"
//                     rowKey="_id"
//                     loading={isFetching}
//                     columns={columns}
//                     dataSource={posts}
//                     // request={fetchPosts}
//                     request={async (params, sort, filter): Promise<any> => {
//                         const query = buildQuery(params, sort, filter, user);
//                         dispatch(fetchPost({ query }))
//                     }}
//                     scroll={{ x: true }}
//                     pagination={
//                         {
//                             current: meta.current,
//                             pageSize: meta.pageSize,
//                             showSizeChanger: true,
//                             total: meta.total,
//                             showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} / {total} </div>) }
//                         }
//                     }
//                     rowSelection={false}
//                     toolBarRender={(_action, _rows): any => {
//                         return (
//                             <Access
//                                 permission={ALL_PERMISSIONS.POSTS.CREATE}
//                                 hideChildren
//                             >
//                                 <Button
//                                     icon={<PlusOutlined />}
//                                     type="primary"
//                                     onClick={() => setOpenModal(true)}
//                                 >
//                                     Thêm mới
//                                 </Button>
//                             </Access>
//                         );
//                     }}
//                 />
//             </Access>
//             <ModalPost
//                 openModal={openModal}
//                 setOpenModal={setOpenModal}
//                 reloadTable={reloadTable}
//                 dataInit={dataInit}
//                 setDataInit={setDataInit}
//             />
//         </div>
//     )
// }

// export default PostPage;

import ModalPost from "@/components/admin/post/modal.post";
import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchPost } from "@/redux/slice/postSlice";
import { IPost } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callDeletePost } from "@/config/api";
import queryString from 'query-string';
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import parse from "html-react-parser";

const PostPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IPost | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.post.isFetching);
    const meta = useAppSelector(state => state.post.meta);
    const posts = useAppSelector(state => state.post.result);
    const user = useAppSelector(state => state.account.user);
    const dispatch = useAppDispatch();

    const handleDeletePost = async (_id: string | undefined) => {
        if (_id) {
            const res = await callDeletePost(_id);
            if (res && res.data) {
                message.success('Xóa bài viết thành công');
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

    const truncateText = (text: string | undefined, limit: number) => {
        if (typeof text !== 'string' || !text.trim()) return ""; // Nếu dữ liệu không phải là chuỗi hoặc là chuỗi trống, trả về chuỗi rỗng
        const words = text.trim().split(/\s+/); // Tách các từ bằng khoảng trắng
        if (words.length > limit) {
            return words.slice(0, limit).join(' ') + '...'; // Nếu số từ vượt quá giới hạn, chỉ lấy số từ giới hạn và thêm dấu "..."
        }
        return text; // Trả về văn bản gốc nếu không vượt quá giới hạn từ
    };

    const columns: ProColumns<IPost>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1) + (meta.current - 1) * (meta.pageSize)}
                    </>)
            },
            hideInSearch: true,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            width: 250,
            render: (text, record, index, action) => {
                return (
                    <span>
                        {record._id}
                    </span>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            sorter: true,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            sorter: true,
            render: text => truncateText(text as any, 100), 
        },
        // {
        //     title: 'Nội dung',
        //     dataIndex: 'content',
        //     sorter: true,
        //     render: (text, record, index, action) => {
        //         return (
        //             <>{parse(record?.content ?? "")}</>
        //         )
        //     },
        // },
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
        {
            title: 'Hành động',
            hideInSearch: true,
            width: 90,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.POSTS.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                setOpenModal(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.POSTS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa bài viết"}
                            description={"Bạn có chắc chắn muốn xóa bài viết này ?"}
                            onConfirm={() => handleDeletePost(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 20,
                                        color: '#ff4d4f',
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any, user: any) => {
        const clone = { ...params };
        if (clone.title) clone.title = `/${clone.title}/i`;
        if (clone.description) clone.description = `/${clone.description}/i`;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.title) {
            sortBy = sort.title === 'ascend' ? "sort=title" : "sort=-title";
        }
        if (sort && sort.description) {
            sortBy = sort.description === 'ascend' ? "sort=description" : "sort=-description";
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
        // Thêm điều kiện để chỉ lấy các bài viết mà người dùng có quyền xem
        if (user?.post?._id) {
            temp = `${temp}&post._id=${user.post._id}`;
        }
        return temp;
    }
    console.log(">>>Check data: ", posts)

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.POSTS.GET_PAGINATE}>
                <DataTable<IPost>
                    actionRef={tableRef}
                    headerTitle="Danh sách bài viết"
                    rowKey="_id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={posts}
                    // request={fetchPosts}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter, user);
                        dispatch(fetchPost({ query }));
                    }}
                    scroll={{ x: true }}
                    pagination={{
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => {
                            return (
                                <div>
                                    {range[0]}-{range[1]} / {total}
                                </div>
                            );
                        },
                    }}
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Access permission={ALL_PERMISSIONS.POSTS.CREATE} hideChildren>
                                <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModal(true)}>
                                    Thêm mới
                                </Button>
                            </Access>
                        );
                    }}
                />
            </Access>
            <ModalPost
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    );
}

export default PostPage;
