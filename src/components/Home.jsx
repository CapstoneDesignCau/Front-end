import React from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { Camera, Users, MessageCircle, Award } from 'lucide-react';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const HomeContainer = styled.div`
  min-height: 100vh;
  background-color: #f0f0f0;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const SliderContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  .slick-slide img {
    width: 100%;
    height: 70vh;
    object-fit: cover;
  }
  .slick-prev, .slick-next {
    z-index: 1;
    &:before {
      font-size: 30px;
      color: #333;
    }
  }
  .slick-prev {
    left: 10px;
  }
  .slick-next {
    right: 10px;
  }
`;

const SlideContent = styled.div`
  position: relative;
  cursor: pointer;
`;

const SlideCaption = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

const EvaluationCriteriaContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const CriteriaItem = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const CriteriaImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CriteriaContent = styled.div`
  padding: 1.5rem;
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

const CommunityHighlightsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const HighlightItem = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const HighlightTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const HighlightMeta = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const StatisticsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const StatItem = styled.div`
  background-color: #ffffff;
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

export default function Home() {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  const slides = [
    { image: '/slide1.jpg', caption: '전문가의 피드백으로 더 나은 포즈를 만들어보세요' },
    { image: '/slide2.jpg', caption: '다양한 각도에서의 피드백으로 완벽한 사진을 찍어보세요' },
    { image: '/slide3.jpg', caption: '인물 전신 사진의 구도와 포즈를 개선해보세요' },
    { image: '/slide4.jpg', caption: '프로페셔널한 look을 위한 맞춤형 조언을 받아보세요' },
  ];

  const evaluationCriteria = [
    {
      title: "포즈",
      description: "자연스러운 자세와 표정, 신체의 균형과 라인을 평가합니다.",
      image: "/placeholder.svg?height=200&width=300&text=Pose",
      learningMaterial: "/learning/pose"
    },
    {
      title: "구도",
      description: "사진의 전체적인 구성, 배경과의 조화, 주요 피사체의 위치를 평가합니다.",
      image: "/placeholder.svg?height=200&width=300&text=Composition",
      learningMaterial: "/learning/composition"
    },
    {
      title: "조명",
      description: "빛의 방향, 강도, 색온도가 피사체를 어떻게 표현하는지 평가합니다.",
      image: "/placeholder.svg?height=200&width=300&text=Lighting",
      learningMaterial: "/learning/lighting"
    },
    {
      title: "의상 및 소품",
      description: "의상의 적절성, 액세서리와 소품의 활용도를 평가합니다.",
      image: "/placeholder.svg?height=200&width=300&text=Styling",
      learningMaterial: "/learning/styling"
    },
    {
      title: "전체적인 인상",
      description: "사진이 전달하는 전반적인 분위기와 메시지를 평가합니다.",
      image: "/placeholder.svg?height=200&width=300&text=Overall+Impression",
      learningMaterial: "/learning/overall-impression"
    }
  ];

  const communityHighlights = [
    { title: "최고의 포즈 팁 공유", author: "포즈마스터", comments: 42, link: "/community/post/1" },
    { title: "야외 촬영 노하우", author: "자연광러버", comments: 38, link: "/community/post/2" },
    { title: "셀프 촬영 꿀팁 모음", author: "셀카여신", comments: 55, link: "/community/post/3" },
  ];

  const stats = [
    { icon: <Camera size={32} />, value: "10,000+", label: "피드백 받은 사진" },
    { icon: <Users size={32} />, value: "5,000+", label: "활성 사용자" },
    { icon: <MessageCircle size={32} />, value: "50,000+", label: "제공된 피드백" },
    { icon: <Award size={32} />, value: "50+", label: "전문가 평가단" },
  ];

  return (
    <HomeContainer>
      <SliderContainer>
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <SlideContent key={index}>
              <img src={slide.image} alt={`Slide ${index + 1}`} />
              <SlideCaption>{slide.caption}</SlideCaption>
            </SlideContent>
          ))}
        </Slider>
      </SliderContainer>
      <ContentWrapper>
        <SectionTitle>평가 기준</SectionTitle>
        <EvaluationCriteriaContainer>
          {evaluationCriteria.map((criteria, index) => (
            <CriteriaItem key={index} onClick={() => navigate(criteria.learningMaterial)}>
              <CriteriaImage src={criteria.image} alt={criteria.title} />
              <CriteriaContent>
                <CriteriaTitle>{criteria.title}</CriteriaTitle>
                <CriteriaDescription>{criteria.description}</CriteriaDescription>
              </CriteriaContent>
            </CriteriaItem>
          ))}
        </EvaluationCriteriaContainer>

        <SectionTitle>커뮤니티 인기 게시글</SectionTitle>
        <CommunityHighlightsContainer>
          {communityHighlights.map((highlight, index) => (
            <HighlightItem key={index} onClick={() => navigate(highlight.link)}>
              <HighlightTitle>{highlight.title}</HighlightTitle>
              <HighlightMeta>
                작성자: {highlight.author} | 댓글: {highlight.comments}
              </HighlightMeta>
            </HighlightItem>
          ))}
        </CommunityHighlightsContainer>

        <SectionTitle>서비스 통계</SectionTitle>
        <StatisticsContainer>
          {stats.map((stat, index) => (
            <StatItem key={index}>
              <StatIcon>{stat.icon}</StatIcon>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatisticsContainer>
      </ContentWrapper>
    </HomeContainer>
  );
}