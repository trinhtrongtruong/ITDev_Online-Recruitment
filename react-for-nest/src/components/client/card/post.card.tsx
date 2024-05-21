import { callFetchPost } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { IPost } from '@/types/backend';
import { Card, Col, Divider, Empty, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';

interface IProps {
    showPagination?: boolean;
}

const PostCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayPost, setDisplayPost] = useState<IPost[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const navigate = useNavigate();

    useEffect(() => {
        fetchPost();
    }, [current, pageSize, filter, sortQuery]);

    const fetchPost = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchPost(query);
        console.log('res', res)
        if (res && res.data) {
            setDisplayPost(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }


    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleViewDetailJob = (item: IPost) => {
        if (item.title) {
            const slug = convertSlug(item.title);
            navigate(`/post/${slug}?id=${item._id}`)
        }
    }

    return (
        <div id='changePost' className={`${styles["post-section"]}`}>
            <div className={styles["post-content"]}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <span className={styles["title"]}>Bài viết nổi bật</span>
                                {!showPagination &&
                                    <Link to="post">Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayPost?.map(item => {
                            return (
                                <Col span={24} md={8} key={item._id}>
                                    <Card
                                        onClick={() => handleViewDetailJob(item)}
                                        className={styles["post-card"]}
                                        hoverable
                                        cover={
                                            <div className={styles["card-customize"]} >
                                                <img className={styles["card-customize-image"]}
                                                    alt="example"
                                                    style={{translate: '-22.5%',width: '180%', height: '240px', objectFit: 'cover' }}
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/post/${item?.image}`}
                                                />
                                            </div>
                                        }
                                    >
                                        <h2 style={{lineHeight:'28px', minHeight: '56px', marginTop: '12px'}}>{item.title}</h2>
                                        <p style={{marginTop: '10px'}}>{item.description?.slice(0, 100)}</p>
                                    </Card>
                                </Col>
                            )
                        })}

                        {(!displayPost || displayPost && displayPost.length === 0)
                            && !isLoading &&
                            <div className={styles["empty"]}>
                                <Empty description="Không có dữ liệu" />
                            </div>
                        }
                    </Row>
                    {showPagination && <>
                        <div style={{ marginTop: 30 }}></div>
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                responsive
                                onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                            />
                        </Row>
                    </>}
                </Spin>
            </div>
        </div>
    )
}

export default PostCard;