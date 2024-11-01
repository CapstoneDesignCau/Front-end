import React from "react";
import styled, { keyframes } from "styled-components";

const sway = keyframes`
  0%, 100% { transform: rotate(-1deg) translateY(0); }
  50% { transform: rotate(1deg) translateY(-10px); }
`;

const Container = styled.div`
  min-height: 100vh;
  background-color: #f0f0f0;
  padding: 4rem 2rem;
  overflow-x: hidden;
`;

const GalleryContainer = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20rem;
`;

const StringLine = styled.div`
  width: 100%;
  height: 3px;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  animation: ${sway} 8s ease-in-out infinite;
  z-index: 1; /* 낮은 z-index */

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #4a90e2;
    clip-path: path('M0,20 Q25,-30 50,20 Q75,70 100,20');
    z-index: -1; /* 선이 이미지 뒤에 오도록 */
  }

  &:nth-child(1) {
    animation-delay: -4s;
    transform: scaleY(-1);
    margin-bottom: 2rem;
  }
`;

const PolaroidWrapper = styled.div`
  position: relative;
  transform-origin: top center;
  animation: ${sway} 8s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 2; /* 이미지가 선 위에 오도록 */
  
  &:nth-child(1) { margin-top: -20px; }
  &:nth-child(2) { margin-top: 30px; }
  &:nth-child(3) { margin-top: 30px; }
  &:nth-child(4) { 
    margin-top: 80px;
    margin-right: -30px;
  }
`;

const Clip = styled.div`
  width: 24px;
  height: 50px;
  position: relative;
  margin-bottom: -25px;
  z-index: 3; /* 클립이 이미지 위에 오도록 */
  margin-top: -25px;

  ${PolaroidWrapper}:nth-child(4) & {
    transform: translateX(20px);
  }

  &::before, &::after {
    content: '';
    position: absolute;
    left: 50%;
    width: 16px;
    background: linear-gradient(145deg, #f0f0f0, #e6e6e6);
    border: 2px solid #888;
    transform: translateX(-50%);
  }

  &::before {
    top: 0;
    height: 30px;
    border-radius: 16px 16px 0 0;
    box-shadow: inset 1px 1px 2px rgba(255,255,255,0.5);
  }

  &::after {
    bottom: 0;
    height: 25px;
    border-radius: 0 0 16px 16px;
    box-shadow: inset -1px -1px 2px rgba(0,0,0,0.1);
  }
`;

const Polaroid = styled.div`
  background: white;
  padding: 12px 12px 35px 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 200px;
  transform: rotate(${props => props.rotation}deg);
  transition: transform 0.3s ease-in-out;
  position: relative;
  top: -20px;
  z-index: 2; /* 이미지가 선 위에 오도록 */

  &:hover {
    transform: rotate(${props => props.rotation}deg) scale(1.05);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    background: #f8f8f8;
  }
`;

const PolaroidGallery = () => {
  const images = [
    "/slide1.jpg",
    "/slide2.jpg",
    "/slide3.jpg",
    "/slide4.jpg",
    "/slide1.jpg",
    "/slide2.jpg",
    "/slide3.jpg",
    "/slide4.jpg"
  ];

  const getRotation = (index) => {
    const rotations = [-12, -4, 4, 12];
    return rotations[index % 4];
  };

  const getYOffset = (index) => {
    if (index % 4 === 0) return -20;
    if (index % 4 === 3) return 80;
    return 30;
  };

  return (
    <Container>
      <GalleryContainer>
        <StringLine>
          {images.slice(0, 4).map((src, index) => (
            <PolaroidWrapper
              key={index}
              delay={index * -1.2}
              style={{
                marginTop: `${getYOffset(index)}px`
              }}
            >
              <Clip />
              <Polaroid rotation={getRotation(index)}>
                <img src={src} alt={`Polaroid ${index + 1}`} />
              </Polaroid>
            </PolaroidWrapper>
          ))}
        </StringLine>
        <StringLine>
          {images.slice(4).map((src, index) => (
            <PolaroidWrapper
              key={index + 4}
              delay={(index + 4) * -1.2}
              style={{
                marginTop: `${getYOffset(index)}px`
              }}
            >
              <Clip />
              <Polaroid rotation={getRotation(index)}>
                <img src={src} alt={`Polaroid ${index + 5}`} />
              </Polaroid>
            </PolaroidWrapper>
          ))}
        </StringLine>
      </GalleryContainer>
    </Container>
  );
};

export default PolaroidGallery;