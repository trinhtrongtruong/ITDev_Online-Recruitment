import { callFetchJob } from '@/config/api';
import { LOCATION_LIST, convertSlug, getLocationName } from '@/config/utils';
import { IJob } from '@/types/backend';
import { EnvironmentOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Pagination, Row, Spin, ConfigProvider } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import styles from 'styles/client.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// import enUS from 'antd/locale/en_US';
dayjs.extend(relativeTime)

interface IProps {
    showPagination?: boolean;
}

const JobCard = (props: IProps) => {
    const { showPagination = false } = props;

    const location = useLocation();
    const [filterSkills , setFilterSkills] = useState<string[]>([]);
    const [filterlocation , setFilterlocation] = useState<string[]>([]);
    const queryParams = queryString.parse(location.search);
    

    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const navigate = useNavigate();

    useEffect(() => {
        fetchJob();
    }, [
         current, pageSize, filter, sortQuery, 
         queryParams.skills, queryParams.location, 
    ]); 

    const fetchJob = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        // let queryParamsSkills = typeof queryParams.skills === 'string' ? queryParams.skills.split(',') : [];
        // if (queryParamsSkills.length > 0) {
        //     const skillsQuery = queryParamsSkills.map(skill => `skills=${skill}`).join('&');
        //     query += `&${skillsQuery}`;
        // }

        // Sử dụng queryParams.skills trực tiếp
        let skills = typeof queryParams.skills === 'string' ? queryParams.skills.split(',') : [];
        if (skills.length > 0) {
        const skillsQuery = skills.map(skill => `skills=${skill}`).join('&');
        query += `&${skillsQuery}`; 
        }else {
            let location = typeof queryParams.location === 'string' ? queryParams.location.split(',') : [];
            if (location.length > 0) {
            const locationQuery = location.map(location => `location=${location}`).join('&');
            query += `&${locationQuery}`;
            } else {
                // Gửi một giá trị mặc định nếu không có location được chọn
                query += '';
            }
        }
        // Sử dụng queryParams.location trực tiếp
        let location = typeof queryParams.location === 'string' ? queryParams.location.split(',') : [];
        if (location.length > 0) {
        const locationQuery = location.map(location => `location=${location}`).join('&');
        query += `&${locationQuery}`;
        } else {
            // Gửi một giá trị mặc định nếu không có location được chọn
            query += '';
        }

        const res = await callFetchJob(query);
        if (res && res.data) {
            setDisplayJob(res.data.result);
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

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.name);
        navigate(`/job/${slug}?id=${item._id}`)
    }
    dayjs.locale('en')// config locale


    return (
        <div id='changeJob' className={`${styles["card-job-section"]}`}>
            <div className={`${styles["job-content"]}`}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <span className={styles["title"]}>Việc Làm Mới Nhất</span>
                                {!showPagination &&
                                    <Link to="job">Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayJob?.map(item => {
                            if (item.isActive) {
                                return (
                                    // <ConfigProvider locale={enUS}>
                                    <Col span={24} md={12} key={item._id}>
                                        <Card size="small" title={null} hoverable
                                            onClick={() => handleViewDetailJob(item)}
                                        >
                                            <div className={styles["card-job-content"]}>
                                                <div className={styles["card-job-left"]}>
                                                    <img
                                                        alt="example"
                                                        src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${item?.company?.logo}`}
                                                    />
                                                </div>
                                                <div className={styles["card-job-right"]}>
                                                    <div className={styles["job-title"]}>{item.name}</div>
                                                    <div className={styles["job-location"]}><EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{getLocationName(item.location)}</div>
                                                    <div><ThunderboltOutlined style={{ color: 'orange' }} />&nbsp;{(item.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</div>
                                                    <div className={styles["job-updatedAt"]}>{dayjs(item.updatedAt).fromNow()}</div>
                                                </div>
                                            </div>

                                        </Card>
                                    </Col>
                                    // </ConfigProvider>
                                )
                            }
                        })}


                        {(!displayJob || displayJob && displayJob.length === 0)
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

export default JobCard;
