import React from 'react';
import styled from 'styled-components';
import { Camera, Users, MessageCircle, Award } from 'lucide-react';

const StatisticsContainer = styled.section`
  background-color: #e9ecef;
  padding: 2rem;
  margin: 2rem 0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatIcon = styled.div`
  margin-bottom: 0.5rem;
  color: #4a90e2;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #666;
`;

const Statistics = () => {
  const stats = [
    { icon: <Camera size={32} />, value: "10,000+", label: "피드백 받은 사진" },
    { icon: <Users size={32} />, value: "5,000+", label: "활성 사용자" },
    { icon: <MessageCircle size={32} />, value: "50,000+", label: "제공된 피드백" },
    { icon: <Award size={32} />, value: "50+", label: "전문가 평가단" },
  ];

  return (
    <StatisticsContainer>
      <Title>서비스 통계</Title>
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatItem key={index}>
            <StatIcon>{stat.icon}</StatIcon>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatItem>
        ))}
      </StatsGrid>
    </StatisticsContainer>
  );
};

export default Statistics;