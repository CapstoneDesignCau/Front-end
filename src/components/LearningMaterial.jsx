import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const PageContainer = styled.div`
  width: 1200px;
  height: 550px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.3s ease-out;
`;

const TitleBar = styled.div`
  color: #333;
  padding: 1rem;
  font-size: 1.5rem;
  z-index: 10;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const ImageSection = styled.div`
  position: relative;
  width: 600px;
  height: 500px;
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease-in-out;
  opacity: ${props => props.isActive ? 1 : 0};
`;

const InfoSection = styled.div`
  width: 600px;
  height: 500px;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InfoContainer = styled.div`
  width: 90%;
  height: 90%;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
`;

const InfoBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  padding: 2rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  animation: ${slideIn} 0.5s ease-out;
  display: ${props => props.isActive ? 'block' : 'none'};
`;

const Title = styled.h2`
  color: #343a40;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const Content = styled.p`
  color: #495057;
  line-height: 1.6;
`;

const NavButtons = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  background-color: #4a4a4a;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #666;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const learningMaterials = [
  {
    id: 1,
    title: "자연 사진 촬영 기법",
    images: [
      '/placeholder.svg?height=600&width=600&text=Nature+Photo+1',
      '/placeholder.svg?height=600&width=600&text=Nature+Photo+2',
      '/placeholder.svg?height=600&width=600&text=Nature+Photo+3',
    ],
    info: [
      {
        title: "이럴 때 참고하세요!",
        content: "야외 촬영 시 자연광을 최대한 활용하세요."
      },
      {
        title: "핵심 키워드!",
        content: "구도, 자연광, 피사체"
      },
      {
        title: "사진 예쁘게 찍는 법",
        content: "삼분할 구도를 활용하고, 피사체에 초점을 맞추세요."
      },
      {
        title: "추가 꿀팁!",
        content: "골든아워(일출 직후, 일몰 직전)에 촬영하면 더욱 아름다운 사진을 얻을 수 있어요!"
      }
    ]
  },
  {
    id: 2,
    title: "인물 사진 촬영 기법",
    images: [
      '/placeholder.svg?height=600&width=600&text=Portrait+Photo+1',
      '/placeholder.svg?height=600&width=600&text=Portrait+Photo+2',
      '/placeholder.svg?height=600&width=600&text=Portrait+Photo+3',
    ],
    info: [
      {
        title: "이럴 때 참고하세요!",
        content: "인물 촬영 시 자연스러운 표정을 유도하세요."
      },
      {
        title: "핵심 키워드!",
        content: "포즈, 조명, 배경"
      },
      {
        title: "사진 예쁘게 찍는 법",
        content: "눈높이에 맞춰 촬영하고, 부드러운 조명을 사용하세요."
      },
      {
        title: "추가 꿀팁!",
        content: "모델과 대화를 나누며 촬영하면 더 자연스러운 표정을 얻을 수 있어요!"
      }
    ]
  },
];

export default function Component() {
  const { learningId } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentInfoIndex, setCurrentInfoIndex] = useState(0);

  const learningMaterial = learningMaterials.find(material => material.id === Number(learningId));

  useEffect(() => {
    if (!learningMaterial) {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % learningMaterial.images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [learningMaterial, navigate]);

  if (!learningMaterial) {
    return null;
  }

  const handleNextInfo = () => {
    setCurrentInfoIndex((prevIndex) => (prevIndex + 1) % learningMaterial.info.length);
  };

  const handlePrevInfo = () => {
    setCurrentInfoIndex((prevIndex) => (prevIndex - 1 + learningMaterial.info.length) % learningMaterial.info.length);
  };

  return (
    <PageContainer>
      <TitleBar>{learningMaterial.title}</TitleBar>
      <ContentWrapper>
        <ImageSection>
          {learningMaterial.images.map((src, index) => (
            <Image 
              key={src} 
              src={src} 
              alt={`Learning material ${learningId} - image ${index + 1}`} 
              isActive={index === currentImageIndex}
            />
          ))}
        </ImageSection>
        <InfoSection>
          <InfoContainer>
            {learningMaterial.info.map((info, index) => (
              <InfoBox key={index} isActive={index === currentInfoIndex}>
                <Title>{info.title}</Title>
                <Content>{info.content}</Content>
              </InfoBox>
            ))}
            <NavButtons>
              <NavButton onClick={handlePrevInfo}>이전</NavButton>
              <NavButton onClick={handleNextInfo}>다음</NavButton>
            </NavButtons>
          </InfoContainer>
        </InfoSection>
      </ContentWrapper>
    </PageContainer>
  );
}