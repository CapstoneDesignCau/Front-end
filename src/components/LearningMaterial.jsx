import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { getLearningMaterial } from "../api/learningMaterialService";
import useUserStore from "../store/userStorage";
import { setRccToken } from "../api/axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  margin: 0 auto;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.3s ease-out;
`;

const TitleBar = styled.div`
  color: #333;
  padding: 2rem;
  font-size: 1.8rem;
  background-color: #e0e0e0;
  z-index: 10;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  padding: 2rem;
`;

const ImageSection = styled.div`
  width: 50%;
  height: 400px;
`;

const SliderContainer = styled.div`
  width: 100%;
  height: 100%;
  .slick-slide img {
    width: 100%;
    height: 400px;
    object-fit: contain;
  }
  .slick-prev,
  .slick-next {
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

const EnlargedImageOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const EnlargedImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`;

const InfoSection = styled.div`
  width: 50%;
  padding-left: 2rem;
  display: flex;
  flex-direction: column;
`;

const InfoContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const InfoBox = styled.div`
  padding: 2rem;
  animation: ${slideIn} 0.5s ease-out;
  display: ${(props) => (props.isactive === "true" ? "block" : "none")};
  flex-grow: 1;
  overflow-y: auto;
`;

const Title = styled.h2`
  color: #343a40;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const Content = styled.p`
  color: #495057;
  line-height: 1.6;
  white-space: pre-line;
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
`;

const NavButton = styled.button`
  background-color: #4a4a4a;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-left: 1rem;
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

const LoadingMessage = styled.div`
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  font-size: 1.5rem;
  color: #ff0000;
  text-align: center;
  margin-top: 2rem;
`;

export default function Component() {
  const { learningId } = useParams();
  const navigate = useNavigate();
  const [currentInfoIndex, setCurrentInfoIndex] = useState(0);
  const [learningMaterial, setLearningMaterial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useUserStore();
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    if (accessToken === null) {
      alert("학습자료를 확인하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setRccToken(accessToken);

    const fetchLearningMaterial = async () => {
      try {
        const response = await getLearningMaterial(learningId);
        if (response.data.isSuccess) {
          const material = response.data.result;
          setLearningMaterial({
            id: material.id,
            title: material.title,
            images: material.images.map((img) => ({
              image: img.fileUrl,
            })),
            info: [
              { title: "이럴 때 참고하세요!", content: material.referenceInfo },
              {
                title: "핵심 키워드!",
                content: material.keyWord || "키워드가 없습니다.",
              },
              { title: "사진 예쁘게 찍는 법", content: material.prettyManner },
              { title: "추가 꿀팁!", content: material.tips },
            ],
          });
        } else {
          throw new Error("Failed to fetch learning material");
        }
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch learning material. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchLearningMaterial();
  }, [accessToken, learningId, navigate]);

  const handleNextInfo = () => {
    if (learningMaterial) {
      setCurrentInfoIndex(
        (prevIndex) => (prevIndex + 1) % learningMaterial.info.length
      );
    }
  };

  const handlePrevInfo = () => {
    if (learningMaterial) {
      setCurrentInfoIndex(
        (prevIndex) =>
          (prevIndex - 1 + learningMaterial.info.length) %
          learningMaterial.info.length
      );
    }
  };

  const handleImageClick = (src) => {
    setEnlargedImage(src);
  };

  const handleCloseEnlargedImage = () => {
    setEnlargedImage(null);
  };

  const settings = {
    dots: true,
    infinite: learningMaterial?.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: learningMaterial?.images.length > 1,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  if (isLoading) {
    return <LoadingMessage>Loading learning material...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!learningMaterial) {
    return null;
  }

  return (
    <PageContainer>
      <TitleBar>{learningMaterial.title}</TitleBar>
      <ContentWrapper>
        <ImageSection>
          <SliderContainer>
            <Slider {...settings}>
              {learningMaterial.images.map((slide, index) => (
                <SlideContent
                  key={index}
                  onClick={() => handleImageClick(slide.image)}
                >
                  <img src={slide.image} alt={`Slide ${index + 1}`} />
                </SlideContent>
              ))}
            </Slider>
          </SliderContainer>
        </ImageSection>
        <InfoSection>
          <InfoContainer>
            {learningMaterial.info.map((info, index) => (
              <InfoBox key={index} isactive={(index === currentInfoIndex).toString()}>
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
      {enlargedImage && (
        <EnlargedImageOverlay onClick={handleCloseEnlargedImage}>
          <EnlargedImage src={enlargedImage} alt="Enlarged view" />
        </EnlargedImageOverlay>
      )}
    </PageContainer>
  );
}
