import { ChartData } from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto'; 
import '../../styles/chart.scss';

interface Resume {
  companyId: string;
  createdAt: string;
  history: { status: string }[];
}

interface Company {
  data: {
    _id: string;
    name: string;
  };
}

interface TableData {
  companyId: string;
  companyName: string;
  pending: number;
  reviewing: number;
  approved: number;
  rejected: number;
}

interface BarChartProps {
  onChartDataLengthChange: (
    companiesLength: number, 
    cvLength: number, 
    countCVPending: number, 
    countCVReviewing: number, 
    countCVApproved: number, 
    countCVRejected: number, 
  ) => void;
}

const BarChart: React.FC<BarChartProps> = ({ onChartDataLengthChange }) => {
  const [chartData, setChartData] = useState<ChartData<"bar", number[], unknown>>({
    labels: [],
    datasets: [
      {
        label: "CV",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [initialLoad, setInitialLoad] = useState(true);
  const [tableData, setTableData] = useState<TableData[]>([]);

  const fetchResumes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/resumes?pageSize=9999", {
        method: "GET",
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjYwYmM1ZTk4YjgwYzQwZTBmZThiMmQ0IiwibmFtZSI6IkknbSBhZG1pbiIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6eyJfaWQiOiI2NjBiYzVlODhiODBjNDBlMGZlOGIyYzQiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMjMtMDQtMThUMTM6Mzk6MjUuODk5WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDQtMThUMTM6Mzk6MjUuODk5WiIsIl9fdiI6MCwiX3JvbGUiOiJhZG1pbiJ9LCJpYXQiOjE2NDk1MDIzMTMsImV4cCI6MTY0OTU4MjMxM30.0rvDx2Us3CuyUwBwy7VxgSkDvtmmUi9UCqKgBDDbjZc",
        },
      });
      const data = await response.json();
      console.log("Resumes data:", data);

      let filteredResumeData = data.data.result;

      if (startDate && endDate) {
        filteredResumeData = data.data.result.filter((resume: Resume) => {
          const createdAtDate = new Date(resume.createdAt);
          const startDateDate = new Date(startDate);
          const endDateDate = new Date(endDate);
          return createdAtDate >= startDateDate && createdAtDate <= endDateDate;
        });
      }

      if (filteredResumeData.length === 0) {
        console.log("No data found for the selected date range");
        setChartData({
          labels: [],
          datasets: [{
            label: "Number of cover letters",
            data: [],
            backgroundColor: "rgba(54, 162, 235, 1)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            borderRadius: 10,
          }],
        });
        onChartDataLengthChange(0, 0, 0, 0, 0, 0);
        return;
      }

      const resumeCounts = filteredResumeData.reduce((acc: Record<string, number>, resume: Resume) => {
        acc[resume.companyId] = (acc[resume.companyId] || 0) + 1;
        return acc;
      }, {});

      const companyDataArray = await fetchCompanyData(resumeCounts);
      console.log(">>>Check companyDataArray: ", companyDataArray);
      console.log(">>>Check resumeCounts: ", resumeCounts);

      setChartData({
        labels: companyDataArray.map((item) => item.name),
        datasets: [
          {
            label: "Number of cover letters",
            data: companyDataArray.map((item) => item.count),
            backgroundColor: "rgba(54, 162, 235, 1)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            borderRadius: 10,
          },
        ],
      });

      calculateCVStatuses(filteredResumeData, companyDataArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCompanyData = async (resumeCounts: Record<string, number>) => {
    const chartDataArray: { companyId: string; name: string; count: number }[] = [];

    for (const companyId in resumeCounts) {
      if (resumeCounts.hasOwnProperty(companyId)) {
        const companyResponse = await fetch(`http://localhost:8000/api/v1/companies/${companyId}`);
        const companyData: Company = await companyResponse.json();
        const companyName = companyData?.data?.name;
        if (companyName) {
          chartDataArray.push({ companyId, name: companyName, count: resumeCounts[companyId] });
        }
      }
    }
    console.log(">>>Check chartDataArray: ",chartDataArray)
    return chartDataArray;
  };

  const calculateCVStatuses = (resumes: Resume[], companyDataArray: { companyId: string; name: string; count: number }[]) => {
    let countPending = 0;
    let countReviewing = 0;
    let countApproved = 0;
    let countRejected = 0;
    resumes.forEach((resume) => {
            const status = resume.history[resume.history.length - 1]?.status;
            switch (status) {
              case "PENDING":
                countPending++;
                break;
              case "REVIEWING":
                countReviewing++;
                break;
              case "APPROVED":
                countApproved++;
                break;
              case "REJECTED":
                countRejected++;
                break;
            }
    })

    const companyStatusCounts: Record<string, { pending: number; reviewing: number; approved: number; rejected: number }> = {};

    const normalizeStatus = (status: string): keyof typeof companyStatusCounts[""] | "" => {
      switch (status.toUpperCase()) {
        case "PENDING":
          return "pending";
        case "REVIEWING":
          return "reviewing";
        case "APPROVED":
          return "approved";
        case "REJECTED":
          return "rejected";
        default:
          return "";
      }
    };

    resumes.forEach((resume) => {
      const status = (resume.history[resume.history.length - 1]?.status || ''); // Đảm bảo status không phải là undefined
      const normalizedStatus = normalizeStatus(status);
      const companyId = resume.companyId;

      if (!companyStatusCounts[companyId]) {
        companyStatusCounts[companyId] = { pending: 0, reviewing: 0, approved: 0, rejected: 0 };
      }

      (companyStatusCounts[companyId] as Record<string, number>)[normalizedStatus]++;
    });

    const tableDataArray: TableData[] = Object.keys(companyStatusCounts).map((companyId) => {
      const companyName = companyDataArray.find(company => company.companyId === companyId)?.name || "Unknown";
      return {
        companyId,
        companyName,
        ...companyStatusCounts[companyId],
      };
    });

    console.log(">>>Check tableDataArray: ", tableDataArray);

    setTableData(tableDataArray);

    onChartDataLengthChange(
      companyDataArray.length,
      resumes.length,
      countPending,
      countReviewing,
      countApproved,
      countRejected
    );
  };

  useEffect(() => {
    if (initialLoad) {
      fetchResumes();
      setInitialLoad(false);
    }
  }, [initialLoad]);

  const handleSubmit = () => {
    fetchResumes();
  };

  return (
    <div className="bar-chart">
      <h2 style={{ color: "#2D2D2D", fontSize: "18px", fontWeight: "500" }}>Thống kê thư xin việc</h2>
      <div className="filter">
        <p style={{fontSize: '16px', fontWeight: '500'}}>Lọc thư xin việc</p>
        <label htmlFor="">Từ ngày:</label>
        <input 
          className="startDate" 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
        />
        <label htmlFor="">Đến ngày:</label>
        <input 
          className="endDate" 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
        />
        <button className="btnSubmit" onClick={handleSubmit}>Thống kê</button>
      </div>

      <Bar className="barChart" data={chartData} options={{ indexAxis: 'y' }} /> 
      {/* scales: { y: { beginAtZero: true } } */}
      <div className="table-wrapper">
        <table className="fl-table">
          <thead>
            <tr>
              <th>TÊN CÔNG TY</th>
              <th>TỔNG SỐ LƯỢNG CV</th>
              <th>CV PENDING</th>
              <th>CV REVIEWING</th>
              <th>CV APPROVED</th>
              <th>CV REJECTED</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.companyId}>
                <td style={{fontSize:'14px', textAlign:'left'}}>{row.companyName}</td>
                <td>{row.pending + row.reviewing + row.approved + row.rejected}</td>
                <td>{row.pending}</td>
                <td>{row.reviewing}</td>
                <td>{row.approved}</td>
                <td>{row.rejected}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BarChart;
