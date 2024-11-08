import React from 'react';
import styled from 'styled-components';

const CriteriaContainer = styled.section`
  background-color: #ffffff;
  padding: 2rem;
  margin: 2rem 0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const CriteriaList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CriteriaItem = styled.li`
  background-color: #f8f9fa;
  border-left: 4px solid #4a90e2;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const CriteriaTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const CriteriaDescription = styled.p`
  font-size: 1rem;
  color: #666;
`;

const EvaluationCriteria = () => {
  const criteria = [
    {
      title: "포즈",
      description: "자연스러운 자세와 표정, 신체의 균형과 라인을 평가합니다."
    },
    {
      title: "구도",
      description: "사진의 전체적인 구성, 배경과의 조화, 주요 피사체의 위치를 평가합니다."
    },
    {
      title: "조명",
      description: "빛의 방향, 강도, 색온도가 피사체를 어떻게 표현하는지 평가합니다."
    },
    {
      title: "의상 및 소품",
      description: "의상의 적절성, 액세서리와 소품의 활용도를 평가합니다."
    },
    {
      title: "전체적인 인상",
      description: "사진이 전달하는 전반적인 분위기와 메시지를 평가합니다."
    }
  ];

  return (
    <CriteriaContainer>
      <Title>우리의 평가 기준</Title>
      <CriteriaList>
        {criteria.map((item, index) => (
          <CriteriaItem key={index}>
            <CriteriaTitle>{item.title}</CriteriaTitle>
            <CriteriaDescription>{item.description}</CriteriaDescription>
          </CriteriaItem>
        ))}
      </CriteriaList>
    </CriteriaContainer>
  );
};

export default EvaluationCriteria;