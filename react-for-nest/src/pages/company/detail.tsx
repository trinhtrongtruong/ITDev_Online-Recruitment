import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICompany, IJob } from "@/types/backend";
import { callFetchCompanyById, callFetchJob } from "@/config/api";
import styles from '../../styles/client.module.scss';
import parse from 'html-react-parser';
import { Card, Col, Divider, Empty, Row, Skeleton, Spin } from "antd";
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import JobCard from "../../components/client/card/job.card";
import { LOCATION_LIST, convertSlug, getLocationName } from '@/config/utils';
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";

const ClientCompanyDetailPage = (props: any) => {
    const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
    const [jobs, setJobs] = useState<IJob[]>([]);
    const [countJobs, setCountJobs] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();


    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // company id

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                if (id) {
                    const companyRes = await callFetchCompanyById(id);
                    if (companyRes?.data) {
                        setCompanyDetail(companyRes.data);
                        // query jobs by companyId
                        const companyQuery = `company._id=${id}`;
                        const jobsRes = await callFetchJob(companyQuery);
                        if (jobsRes?.data) {
                            const activeJobs = jobsRes.data.result.filter(item => item.isActive);
                            setJobs(jobsRes.data.result);
                            setCountJobs(activeJobs.length); // Count Job
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
            
        };

        fetchData();
    }, [id]);
    
    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.name);
        navigate(`/job/${slug}?id=${item._id}`)
    }

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {companyDetail && companyDetail._id &&
                        <>
                            <Col span={24} md={16}>
                                <div className={styles["header"]}>
                                    {companyDetail.name}
                                </div>

                                <div className={styles["location"]}>
                                    <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{(companyDetail?.address)}
                                </div>

                                <Divider />
                                {parse(companyDetail?.description ?? "")}
                            </Col>

                            <Col span={24} md={8}>
                                <div className={styles["company"]}>
                                    <div>
                                        <img className={styles["company-image"]}
                                            alt="example"
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${companyDetail?.logo}`}
                                        />
                                    </div>
                                    <div>
                                        {companyDetail?.name}
                                    </div>
                                </div>
                                {/* <div className={styles["list-jobs"]}>
                                    {jobs.map((job) => (
                                        <JobCard key={job._id}  />
                                    ))}
                                </div> */}
                                <div className={styles["countJobs"]}>
                                    <span className={styles["countJobs__modify"]}>{countJobs}</span> việc làm đang tuyển dụng
                                </div>
                                 <div id='changeJob' className={`${styles["card-job-section"]}`}>
                                    <div className={`${styles["job-content"]}`}>
                                        <Spin spinning={isLoading} tip="Loading...">
                                            <Row gutter={[20, 20]}>
                                                <Col span={24}>
                                                    <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                                        {/* <span className={styles["title"]}>Công Việc Mới Nhất</span>
                                                        {!showPagination &&
                                                            <Link to="job">Xem tất cả</Link>
                                                        } */}
                                                    </div>
                                                </Col>

                                                {jobs?.map(item => {
                                                    if(item.isActive){
                                                        return (
                                                            // <ConfigProvider locale={enUS}>
                                                            <Col span={24} md={24} key={item._id}>
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


                                                {(!jobs || jobs && jobs.length === 0)
                                                    && !isLoading &&
                                                    <div className={styles["empty"]}>
                                                        {/* <Empty description="Không có dữ liệu" /> */}
                                                        Hiện tại {companyDetail?.name} chưa có việc làm
                                                    </div>
                                                }
                                            </Row>
                                        </Spin>
                                    </div>
                                </div>
                            </Col>
                        </>
                    }
                </Row>
            }
        </div>
    )
}

export default ClientCompanyDetailPage;
