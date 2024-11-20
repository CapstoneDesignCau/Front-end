import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { getLearningMaterials } from "../api/learningMaterialService";
import useUserStore from "../store/userStorage";
import { setRccToken } from "../api/axios";

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
  background: radial-gradient(
      circle at 10% 20%,
      rgba(216, 241, 230, 0.46) 0%,
      rgba(216, 241, 230, 0.46) 50.8%,
      rgba(255, 255, 255, 0) 50.8%,
      rgba(255, 255, 255, 0) 100%
    ),
    radial-gradient(
      circle at 90% 80%,
      rgba(255, 229, 168, 0.38) 0%,
      rgba(255, 229, 168, 0.38) 50.8%,
      rgba(255, 255, 255, 0) 50.8%,
      rgba(255, 255, 255, 0) 100%
    );
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
  animation-delay: ${(props) => props.delay}s;
  margin: 0 1rem;

  &:nth-child(1) {
    margin-top: -20px;
  }
  &:nth-child(2) {
    margin-top: 30px;
  }
  &:nth-child(3) {
    margin-top: 10px;
  }
  &:nth-child(4) {
    margin-top: 50px;
  }
`;

const Polaroid = styled.div`
  display: block;
  background: white;
  padding: 12px 12px 35px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 220px;
  transform: rotate(${(props) => props.rotation}deg);
  transition: transform 0.3s ease-in-out;
  position: relative;
  top: -20px;
  border: none;
  cursor: pointer;

  &:hover {
    transform: rotate(${(props) => props.rotation}deg) scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: #f8f8f8;
  }
`;

const PolaroidTitle = styled.div`
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LoadingMessage = styled.div`
  font-size: 1.5rem;
  color: #333;
  text-align: center;
`;

const ErrorMessage = styled.div`
  font-size: 1.5rem;
  color: #ff0000;
  text-align: center;
`;

const Learning = () => {
  const navigate = useNavigate();
  const [learningMaterials, setLearningMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useUserStore();

  useEffect(() => {
    if (accessToken === null) {
      alert("학습자료를 확인하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setRccToken(accessToken);

    const fetchLearningMaterials = async () => {
      try {
        const response = await getLearningMaterials();
        //console.log(response.data);
        if (response.data.isSuccess === true) {
          setLearningMaterials(response.data.result);
        } else {
          throw new Error("Failed to fetch learning materials");
        }
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch learning materials. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchLearningMaterials();
  }, [accessToken, navigate]);

  const getRotation = (index) => {
    const rotations = [-8, -3, 3, 8];
    return rotations[index % 4];
  };

  const getYOffset = (index) => {
    const offsets = [-20, 30, 10, 50];
    return offsets[index % 4];
  };

  const handlePolaroidClick = (id) => {
    if (id != null) {
      navigate(`/learning/${id}`);
    }
  };

  //기본 이미지 설정
  const defaultImages = [
    "/slide1.jpg",
    "/slide2.jpg",
    "/slide3.jpg",
    "/slide4.jpg",
    "/slide1.jpg",
    "/slide2.jpg",
    "/slide3.jpg",
    "/slide4.jpg",
  ];

  const renderPolaroids = (start, end) => {
    const polaroids = [];
    for (let i = start; i < end; i++) {
      const material = learningMaterials[i] || {
        id: null,
        title: "Coming Soon!",
        image: null,
      };
      polaroids.push(
        <PolaroidWrapper
          key={i}
          delay={i * -1.2}
          style={{
            marginTop: `${getYOffset(i)}px`,
          }}
        >
          <Polaroid
            rotation={getRotation(i)}
            onClick={() => handlePolaroidClick(material.id)}
          >
            <img
              src={material.image?.fileUrl || defaultImages[i]}
              alt={`Polaroid ${i + 1}`}
            />
            <PolaroidTitle>{material.title}</PolaroidTitle>
          </Polaroid>
        </PolaroidWrapper>
      );
    }
    return polaroids;
  };

  if (isLoading) {
    return <LoadingMessage>Loading learning materials...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <BackgroundDecoration />
      <GalleryContainer>
        <PolaroidRow>{renderPolaroids(0, 4)}</PolaroidRow>
        <PolaroidRow>{renderPolaroids(4, 8)}</PolaroidRow>
      </GalleryContainer>
    </Container>
  );
};

export default Learning;
