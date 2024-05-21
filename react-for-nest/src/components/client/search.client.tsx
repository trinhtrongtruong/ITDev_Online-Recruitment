import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Select } from 'antd';
import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';
import { LOCATION_LIST, SKILLS_LIST } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';

const SearchClient = () => {
  const optionsSkills = SKILLS_LIST;
  const optionsLocations = LOCATION_LIST;
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // http://localhost:3000/job?skills=&location=HANOI,HOCHIMINH,DANANG,OTHER

  useEffect(() => {
    form.setFieldsValue({ skills: selectedSkills, location: selectedLocations });
  }, [selectedSkills, selectedLocations]);

  const onFinish = async (values: any) => {
    const { skills, location } = values;
    const skillQuery = skills ? skills.join(',') : '';
    let locationQuery = location ? location.join(',') : '';
    if(locationQuery === "ALL" || locationQuery.includes("ALL")) { // check ALL 
      // Lấy tất cả các giá trị trong LOCATION_LIST trừ "ALL"
      const filteredLocations = LOCATION_LIST.filter(loc => loc.value !== "ALL");
      // Gán locationQuery là chuỗi các giá trị của các location
      locationQuery = filteredLocations.map(loc => loc.value).join(',');
    }
    if(!skillQuery)
      {
        navigate(`/job?location=${locationQuery}`);
      }
    if(!locationQuery)
      {
        navigate(`/job?skills=${skillQuery}`);
      }
    if(!skillQuery && !locationQuery)
      {
        navigate(`/job`);
      }
      else{

        navigate(`/job?skills=${skillQuery}&location=${locationQuery}`);
      }
  };

  const handleChangeSkills = (selectedSkills: string[]) => {
    if (selectedSkills) {
      setSelectedSkills(selectedSkills);
    }
  };

  const handleChangeLocations = (selectedLocations: string[]) => {
    if (selectedLocations) {
      setSelectedLocations(selectedLocations);
    }
  };

  // Hàm xáo trộn mảng
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  const availableSkills = ["React.JS", "Vue.JS", "Java", "Nest.JS", "Angular", "TypeScript", "MySQL", "Agile", "AngularJS", "Android", "C#", "PHP", ".NET", "React Native", "SQL", "Oracle"]; // Danh sách các kỹ năng
  const randomSkills = shuffleArray(availableSkills).slice(0, 6); // Lấy ngẫu nhiên 5 kỹ năng
  
  const handleSkillButtonClick = (skill: string) => { // Suggest
    const formattedSkill = skill.toUpperCase().replace(/\s/g, '.');
    setSelectedSkills([formattedSkill]);
    navigate(`/job?skills=${formattedSkill}&location=`);
  };

  return (
    <ProForm
      form={form}
      onFinish={onFinish}
      submitter={{
        render: () => <></>,
      }}
    >
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <h2>Việc Làm IT Cho Developer "Chất"</h2>
        </Col>
        <Col span={24} md={16}>
          <ProForm.Item name="skills">
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
              options={optionsSkills}
              value={selectedSkills}
              onChange={handleChangeSkills}
            />
          </ProForm.Item>
         {/* Suggest */}
          <div style={{ marginTop: 10 }}> 
            <label style={{fontWeight: 500}}>Gợi ý cho bạn:</label>
            <Button
              style={{ marginLeft: 10, marginRight: 10, marginBottom: 10,  }}
              onClick={() => handleSkillButtonClick(randomSkills[0])}
            >
              {randomSkills[0]}
            </Button>
            <Button
              style={{ marginRight: 10, marginBottom: 10 }}
              onClick={() => handleSkillButtonClick(randomSkills[1])}
            >
              {randomSkills[1]}
            </Button>
            <Button
              style={{ marginRight: 10, marginBottom: 10 }}
              onClick={() => handleSkillButtonClick(randomSkills[2])}
            >
              {randomSkills[2]}
            </Button>
            <Button
              style={{ marginRight: 10, marginBottom: 10 }}
              onClick={() => handleSkillButtonClick(randomSkills[3])}
            >
              {randomSkills[3]}
            </Button>
            <Button
              style={{ marginRight: 10, marginBottom: 10 }}
              onClick={() => handleSkillButtonClick(randomSkills[4])}
            >
              {randomSkills[4]}
            </Button>
            <Button
              style={{ marginRight: 10, marginBottom: 10 }}
              onClick={() => handleSkillButtonClick(randomSkills[5])}
            >
              {randomSkills[5]}
            </Button>
            {/* <Button
              style={{ marginRight: 10, marginBottom: 10 }}
              onClick={() => handleSkillButtonClick("TypeScript")}
            >
              TypeScript
            </Button> */}
          </div>
        </Col>
        <Col span={12} md={4}>
          <ProForm.Item name="location">
            <Select
              mode="multiple"
              allowClear
              showArrow={false}
              style={{ width: '100%' }}
              placeholder={
                <>
                  <EnvironmentOutlined /> Địa điểm...
                </>
              }
              optionLabelProp="label"
              options={optionsLocations}
              value={selectedLocations}
              onChange={handleChangeLocations}
            />
          </ProForm.Item>
        </Col>
        <Col span={12} md={4}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Col>
      </Row>
    </ProForm>
  );
};

export default SearchClient;
