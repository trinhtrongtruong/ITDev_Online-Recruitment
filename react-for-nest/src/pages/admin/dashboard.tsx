import { Card, Col, Row, Statistic } from "antd";
import CountUp from 'react-countup';
import BarChart from '../../components/charts/barChart'
import { useEffect, useState } from "react";

const DashboardPage = () => {
    const formatter = (value: number | string) => {
        return (
            <CountUp end={Number(value)} separator="," />
        );
    };
    const [numberOfCompanies, setNumberOfCompanies] = useState<number>(0);
    const [numberOfCVs, setNumberOfCVs] = useState<number>(0);
    const [numberCVPending, setNumberCVPending] = useState<number>(0);
    const [numberCVReviewing, setNumberCVReviewing] = useState<number>(0);
    const [numberCVApproved, setNumberCVApproved] = useState<number>(0);
    const [numberCVRejected, setNumberCVRejected] = useState<number>(0);

    const handleChartDataLengthChange = (companiesLength: number, cvLength: number,  cvPending: number, cvReviewing: number, cvApproved: number, cvRejected: number) => {
        setNumberOfCompanies(companiesLength);
        setNumberOfCVs(cvLength);
        setNumberCVPending(cvPending);
        setNumberCVReviewing(cvReviewing);
        setNumberCVApproved(cvApproved);
        setNumberCVRejected(cvRejected);
      };


    return (
        <Row gutter={[20, 20]}>
            <Col span={24} md={4}>
                <Card title="Tổng" bordered={false} >
                    <Statistic
                        title="Số lượng nhà tuyển dụng"
                        value={numberOfCompanies}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={4}>
                <Card title="Tổng" bordered={false} >
                    <Statistic
                        title="Tổng CV được nộp"
                        value={numberOfCVs}
                        formatter={formatter}
                    />

                </Card>
            </Col>
            <Col span={24} md={4}>
                <Card title="Trạng thái" bordered={false} >
                    <Statistic
                        title="CV PENDING"
                        value={numberCVPending}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={4}>
                <Card title="Trạng thái" bordered={false} >
                    <Statistic
                        title="CV REVIEWING"
                        value={numberCVReviewing}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={4}>
                <Card title="Trạng thái" bordered={false} >
                    <Statistic
                        title="CV APPROVED"
                        value={numberCVApproved}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={4}>
                <Card title="Trạng thái" bordered={false} >
                    <Statistic
                        title="CV REJECTED"
                        value={numberCVRejected}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            

            <Col span={24} md={24}>
                <BarChart onChartDataLengthChange={handleChartDataLengthChange}/>
            </Col>
        </Row>
    )
}

export default DashboardPage;