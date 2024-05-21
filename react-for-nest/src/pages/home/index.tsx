import { Card, Col, ConfigProvider, Divider, Empty, Pagination, Row, Spin } from 'antd';
import styles from 'styles/client.module.scss';
import SearchClient from '@/components/client/search.client';
import JobCard from '@/components/client/card/job.card';
import CompanyCard from '@/components/client/card/company.card';
// import dayjs from 'dayjs';
import en_US from 'antd/locale/en_US';
import PostCard from '@/components/client/card/post.card';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPost } from '@/types/backend';
import { callFetchPost } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';

interface IProps {
    showPagination?: boolean;
}

const HomePage = (props: IProps) => {
    // dayjs.locale('en');
        const { showPagination = false } = props;
    
        const [displayPost, setDisplayPost] = useState<IPost[] | null>(null);
        const [isLoading, setIsLoading] = useState<boolean>(false);
    
        const [current, setCurrent] = useState(1);
        const [pageSize, setPageSize] = useState(5);
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
        <ConfigProvider locale={en_US}>
        <div className={`${styles["container"]} ${styles["home-section"]}`}>
            <div className="search-content" style={{ marginTop: 20 }}>
                <SearchClient />
            </div>
            <Divider />
            <CompanyCard />
            <div style={{ margin: 100 }}></div>
            <Divider />
            <JobCard />
            <div style={{ margin: 100 }}></div>
            <Divider />
            <div id='changePost' className={`${styles["post-section-1"]}`}>
            <div className={styles["post-content-1"]}>
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

                        {displayPost && displayPost.length > 0 && (
                                    <>
                                        <Col span={24} md={12}>
                                            <Card
                                                onClick={() => handleViewDetailJob(displayPost[0])}
                                                className={styles["post-card-1"]}
                                                hoverable
                                                cover={
                                                    <div className={styles["card-customize-1"]}>
                                                        <img className={styles["card-customize-image-1"]}
                                                            alt="example"
                                                            style={{  width: '100%', objectFit: 'cover' }}
                                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/post/${displayPost[0]?.image}`}
                                                        />
                                                    </div>
                                                }
                                            >
                                                <h2 style={{ lineHeight: '28px', minHeight: '56px', marginTop: '-24px' }}>{displayPost[0].title.slice(0, 100)}</h2>
                                                <p style={{ marginTop: '-10px', fontSize: '16px', minHeight: '150px' }}>{displayPost[0].description?.slice(0, 200)}</p>
                                                <p style={{  color: 'blue', fontSize: '16px', }}>Bắt đầu đọc {'>'}</p>
                                            </Card>
                                        </Col>
                                        <Col span={24} md={12}>
                                            <Row gutter={[20, 20]}>
                                                {displayPost.slice(1, 5).map(item => (
                                                    <Col span={12} key={item._id}>
                                                        <Card
                                                            onClick={() => handleViewDetailJob(item)}
                                                            className={styles["post-card-2"]}
                                                            hoverable
                                                            cover={
                                                                <div className={styles["card-customize-2"]}>
                                                                    <img className={styles["card-customize-image-2"]}
                                                                        alt="example"
                                                                        style={{  width: '100%', objectFit: 'cover' }}
                                                                        src={`${import.meta.env.VITE_BACKEND_URL}/images/post/${item?.image}`}
                                                                    />
                                                                </div>
                                                            }
                                                        >
                                                            <h2 style={{fontSize: '18px', lineHeight: '25px', minHeight: '50px', marginTop: '-24px' }}>{item.title.slice(0, 56)}</h2>
                                                            {/* <p style={{ marginTop: '10px' }}>{item.description?.slice(0, 100)}</p> */}
                                                            <p style={{ marginTop: '10px', color: 'blue', fontSize: '16px'  }}>Bắt đầu đọc {'>'}</p>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </>
                                )}

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
        </div>
        </ConfigProvider>
    )
}

export default HomePage;
