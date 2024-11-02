import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Slider from 'react-slick';
import Navigation from './Navigation';
import CommunityHighlights from './CommunityHighlights';
import Statistics from './Statistics';
import EvaluationCriteria from './EvaluationCriteria';
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
  margin: 2rem auto;
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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Home = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };

  const slides = [
    { image: '/slide1.jpg', caption: '전문가의 피드백으로 더 나은 포즈를 만들어보세요' },
    { image: '/slide2.jpg', caption: '다양한 각도에서의 피드백으로 완벽한 사진을 찍어보세요' },
    { image: '/slide3.jpg', caption: '인물 전신 사진의 구도와 포즈를 개선해보세요' },
    { image: '/slide4.jpg', caption: '프로페셔널한 look을 위한 맞춤형 조언을 받아보세요' },
  ];

  const handleSlideClick = (index) => {
    if (!isDragging) {
      switch(index) {
        case 0:
          break;
        default:
          break;
      }
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(false);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e) => {
    if (Math.abs(e.pageX - startX) > 5) {
      setIsDragging(true);
    }
  };

  const handleMouseUp = (index, e) => {
    if (!isDragging) {
      handleSlideClick(index);
    }
    setIsDragging(false);
  };

  return (
    <HomeContainer>
      <SliderContainer>
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <SlideContent 
              key={index} 
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={(e) => handleMouseUp(index, e)}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={(e) => handleMouseUp(index, e)}
            >
              <img src={slide.image} alt={`Slide ${index + 1}`} />
              <SlideCaption>{slide.caption}</SlideCaption>
            </SlideContent>
          ))}
        </Slider>
      </SliderContainer>
      
          {/* <GridContainer>
          <CommunityHighlights />
          <EvaluationCriteria />
        
        </GridContainer> */}
        

      <ContentWrapper>
        
        <GridContainer>
          <CommunityHighlights />
          <EvaluationCriteria />
        </GridContainer>
      </ContentWrapper>
      <Statistics />

    </HomeContainer>
  );
};

export default Home;