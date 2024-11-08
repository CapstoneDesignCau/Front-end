import React from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

const sway = keyframes`
  0%, 100% { transform: rotate(-1deg) translateY(0); }
  50% { transform: rotate(1deg) translateY(-10px); }
`;

const Container = styled.div`
  min-height: 100vh;
  background-color: #f0f0f0;
  padding: 2rem 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 10% 20%, rgba(216, 241, 230, 0.46) 0%, rgba(216, 241, 230, 0.46) 50.8%, rgba(255,255,255, 0) 50.8%, rgba(255,255,255, 0) 100%),
    radial-gradient(circle at 90% 80%, rgba(255, 229, 168, 0.38) 0%, rgba(255, 229, 168, 0.38) 50.8%, rgba(255,255,255, 0) 50.8%, rgba(255,255,255, 0) 100%);
  z-index: 0;
`;

const GalleryContainer = styled.div`
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 6rem;
  z-index: 1;
`;

const PolaroidRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 2rem;
`;

const PolaroidWrapper = styled.div`
  position: relative;
  transform-origin: top center;
  animation: ${sway} 8s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  margin: 0 1rem;
  
  &:nth-child(1) { margin-top: -20px; }
  &:nth-child(2) { margin-top: 30px; }
  &:nth-child(3) { margin-top: 10px; }
  &:nth-child(4) { margin-top: 50px; }
`;

const Polaroid = styled.div`
  display: block;
  background: white;
  padding: 12px 12px 35px 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 220px;
  transform: rotate(${props => props.rotation}deg);
  transition: transform 0.3s ease-in-out;
  position: relative;
  top: -20px;
  border: none;
  cursor: pointer;

  &:hover {
    transform: rotate(${props => props.rotation}deg) scale(1.05);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: #f8f8f8;
  }
`;

const PolaroidGallery = () => {
  const navigate = useNavigate();
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
    const rotations = [-8, -3, 3, 8];
    return rotations[index % 4];
  };

  const getYOffset = (index) => {
    const offsets = [-20, 30, 10, 50];
    return offsets[index % 4];
  };

  const handlePolaroidClick = (index) => {
    navigate(`/learning/${index + 1}`);
  };

  return (
    <Container>
      <BackgroundDecoration />
      <GalleryContainer>
        <PolaroidRow>
          {images.slice(0, 4).map((src, index) => (
            <PolaroidWrapper
              key={index}
              delay={index * -1.2}
              style={{
                marginTop: `${getYOffset(index)}px`
              }}
            >
              <Polaroid 
                rotation={getRotation(index)} 
                onClick={() => handlePolaroidClick(index)}
              >
                <img src={src} alt={`Polaroid ${index + 1}`} />
              </Polaroid>
            </PolaroidWrapper>
          ))}
        </PolaroidRow>
        <PolaroidRow>
          {images.slice(4).map((src, index) => (
            <PolaroidWrapper
              key={index + 4}
              delay={(index + 4) * -1.2}
              style={{
                marginTop: `${getYOffset(index)}px`
              }}
            >
              <Polaroid 
                rotation={getRotation(index)} 
                onClick={() => handlePolaroidClick(index + 4)}
              >
                <img src={src} alt={`Polaroid ${index + 5}`} />
              </Polaroid>
            </PolaroidWrapper>
          ))}
        </PolaroidRow>
      </GalleryContainer>
    </Container>
  );
};

export default PolaroidGallery;