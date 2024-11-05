import React, { useState } from 'react';
import styled from 'styled-components';
import { Camera, Star, ChevronRight } from 'lucide-react';

const FeedbackContainer = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PhotoSection = styled.div`
  flex: 1;
  position: relative;
`;

const Photo = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ChangePhotoButton = styled(Button)`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
`;

const FeedbackSection = styled.div`
  flex: 1;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Score = styled.span`
  font-size: 2rem;
  font-weight: bold;
  margin-right: 0.5rem;
`;

const FeedbackList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FeedbackItem = styled.li`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const FeedbackTitle = styled.h3`
  margin: 0 0 0.5rem 0;
`;

const FeedbackText = styled.p`
  margin: 0 0 0.5rem 0;
`;

const LearningMaterialLink = styled.a`
  display: flex;
  align-items: center;
  color: #0070f3;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

export default function PhotoFeedback() {
  const [photo, setPhoto] = useState('/placeholder.svg?height=400&width=600');

  const handlePhotoChange = () => {
    // 실제 구현에서는 파일 선택 다이얼로그를 열고 선택된 파일을 처리해야 합니다.
    // 여기서는 간단히 다른 이미지로 변경하는 것으로 시뮬레이션합니다.
    setPhoto('/placeholder.svg?height=400&width=600&text=New+Photo');
  };

  const feedbackItems = [
    {
      title: '포즈',
      text: '자연스러운 포즈를 취하고 있지만, 어깨의 긴장을 조금 더 풀면 좋겠습니다.',
      learningMaterial: '/learning/pose'
    },
    {
      title: '표정',
      text: '미소가 자연스럽고 좋습니다. 눈빛에 조금 더 생기를 더하면 더욱 좋을 것 같습니다.',
      learningMaterial: '/learning/expression'
    },
    {
      title: '구도',
      text: '전체적인 구도는 좋지만, 약간의 여백을 더 주면 더 좋을 것 같습니다.',
      learningMaterial: '/learning/composition'
    }
  ];

  return (
    <FeedbackContainer>
      <PhotoSection>
        <Photo src={photo} alt="Uploaded photo" />
        <ChangePhotoButton onClick={handlePhotoChange}>
          <Camera size={16} />
          사진 변경
        </ChangePhotoButton>
      </PhotoSection>
      <FeedbackSection>
        <ScoreContainer>
          <Score>4.5</Score>
          <Star fill="#FFD700" />
          <Star fill="#FFD700" />
          <Star fill="#FFD700" />
          <Star fill="#FFD700" />
          <Star fill="#FFD700" strokeWidth={2} />
        </ScoreContainer>
        <FeedbackList>
          {feedbackItems.map((item, index) => (
            <FeedbackItem key={index}>
              <FeedbackTitle>{item.title}</FeedbackTitle>
              <FeedbackText>{item.text}</FeedbackText>
              <LearningMaterialLink href={item.learningMaterial}>
                관련 학습자료 보기
                <ChevronRight size={16} />
              </LearningMaterialLink>
            </FeedbackItem>
          ))}
        </FeedbackList>
      </FeedbackSection>
    </FeedbackContainer>
  );
}