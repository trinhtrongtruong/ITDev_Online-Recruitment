import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IPost, IJob } from "@/types/backend";
import { callFetchPostById, callFetchJob, callFetchPost } from "@/config/api";
import styles from "../../styles/client.module.scss";
import parse from "html-react-parser";
import { Card, Col, Divider, Empty, Row, Skeleton, Spin } from "antd";
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import JobCard from "../../components/client/card/job.card";
import { LOCATION_LIST, convertSlug, getLocationName } from "@/config/utils";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";

const ClientPostDetailPage = (props: any) => {
  const [postDetail, setPostDetail] = useState<IPost | null>(null);
  const [posts, setPosts] = useState<IPost[] | null>([]);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [countJobs, setCountJobs] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id"); // post id

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const [postRes, postsRes] = await Promise.all([
            callFetchPostById(id),
            callFetchPost("limit=6"),
          ]);
          if (postRes?.data) {
            setPostDetail(postRes.data);
          }
          console.log("postsRes.data", postsRes.data);
          if (postsRes && postsRes.data) {
            const relatedPosts = postsRes.data.result.filter(
              (item) => item._id?.toString() !== id.toString()
            );
            setPosts(relatedPosts.splice(0, 4));
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

  const handleViewDetailPost = (item: IPost) => {
    const slug = convertSlug(item.title);
    navigate(`/post/${slug}?id=${item._id}`);
  };

  return (
    <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Row gutter={[20, 20]}>
          {postDetail && postDetail._id && (
            <>
              <Col span={24} md={16}>
                <div className={styles["post"]}>
                  <div>
                    <div className={styles["header-post"]}>{postDetail.title}</div>
                    <img
                      className={styles["post-image"]}
                      style={{ width: "100%" }}
                      alt="example"
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/post/${
                        postDetail?.image
                      }`}
                    />
                    <div className={styles["post-description"]}>
                      {/* <EnvironmentOutlined style={{ color: "#58aaab" }} /> */}
                      <i>{postDetail?.description}</i>
                    </div>

                    <Divider />
                    {parse(postDetail?.content ?? "")}
                  </div>
                  {/* <div>{postDetail?.description}</div> */}
                </div>
              </Col>
              <Col span={24} md={8}>
                <div
                  style={{
                    padding: "8px",
                  }}
                >
                  <h1 style={{marginTop: '36px'}}>Bài viết liên quan</h1>
                  {posts &&
                    posts.map((item) => (
                      <Card
                      style={{marginTop: '20px', boxShadow: '0 0 5px #d3d3d3'}}
                        onClick={() => handleViewDetailPost(item)}
                        className={styles["post-card"]}
                        hoverable
                        cover={
                          <div className={styles["card-customize"]}>
                            <img
                              className={styles["card-customize-image"]}
                              alt="example"
                              style={{
                                width: "100%",
                                height: "240px",
                                objectFit: "cover",
                              }}
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/images/post/${item?.image}`}
                            />
                          </div>
                        }
                      >
                        <p style={{fontSize:'18px', lineHeight: '24px', marginTop: '-20px', fontWeight: 500}}>{item.title}</p>
                      </Card>
                    ))}
                </div>
              </Col>
            </>
          )}
        </Row>
      )}
    </div>
  );
};

export default ClientPostDetailPage;
