import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllImageEvaluations, getImageEvaluation } from '../api/imageEvaluationService';
import { setRccToken } from '../api/axios';
import useUserStore from '../store/userStorage';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const ImageCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const ImageThumbnail = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ImageInfo = styled.div`
  padding: 1rem;
`;

const ImageName = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
`;

const EvaluationStatus = styled.p`
  font-size: 0.9rem;
  color: ${props => props.finished ? 'green' : 'orange'};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #000000;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #ffffff;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #61dafb;
  }
`;

const DetailImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
`;

const Score = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const FeedbackList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FeedbackItem = styled.li`
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
`;

const FeedbackContent = styled.p`
  white-space: pre-line; /* 줄바꿈을 적용하기 위해 추가 */
`;

const FeedbackTitle = styled.span`
  font-weight: bold;
  color: #333;
`;

const LearningMaterialLink = styled.button`
  display: inline-flex;
  align-items: center;
  color: #007bff;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
  margin-top: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const MoreInfoSection = styled.div`
  margin-top: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  max-height: ${props => props.isOpen ? '1000px' : '56px'};
`;

const MoreInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #e9ecef;
  cursor: pointer;
`;

const MoreInfoTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 0;
`;

const MoreInfoContent = styled.div`
  padding: 1rem;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #007bff;
  display: flex;
  align-items: center;
`;

export default function PhotoEvaluationList() {
  const navigate = useNavigate();
  const { accessToken } = useUserStore();
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken === null) {
      alert("피드백를 확인하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setRccToken(accessToken);
    fetchEvaluations();
  }, [accessToken, navigate]);

  const fetchEvaluations = async () => {
    try {
      const response = await getAllImageEvaluations();
      if (response.data.isSuccess) {
        setEvaluations(response.data.result);
      } else {
        throw new Error(response.data.message || "Failed to fetch evaluations");
      }
    } catch (err) {
      setError("Failed to load evaluations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = async (id) => {
    try {
      const response = await getImageEvaluation(id);
      if (response.data.isSuccess) {
        setSelectedEvaluation(response.data.result);
        setIsMoreInfoOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to fetch evaluation details");
      }
    } catch (err) {
      alert("Failed to load evaluation details. Please try again.");
    }
  };

  const handleLearningMaterialClick = (materialId) => {
    navigate(`/learning/${materialId}`);
  };

  const toggleMoreInfo = () => {
    setIsMoreInfoOpen(!isMoreInfoOpen);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Title>Photo Evaluations</Title>
      <ImageGrid>
        {evaluations.map((evaluation) => (
          <ImageCard key={evaluation.id} onClick={() => handleImageClick(evaluation.id)}>
            <ImageThumbnail src={evaluation.evaluationImage.fileUrl} alt={evaluation.evaluationImage.fileName} />
            <ImageInfo>
              <ImageName>{evaluation.evaluationImage.fileName}</ImageName>
              <EvaluationStatus finished={evaluation.finish}>
                {evaluation.finish ? 'Evaluation Complete' : 'Pending Evaluation'}
              </EvaluationStatus>
            </ImageInfo>
          </ImageCard>
        ))}
      </ImageGrid>

      {selectedEvaluation && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={() => setSelectedEvaluation(null)}>&times;</CloseButton>
            <DetailImage src={selectedEvaluation.evaluationImage.fileUrl} alt={selectedEvaluation.evaluationImage.fileName} />
            <Score>Score: {selectedEvaluation.score}</Score>
            <FeedbackList>
              {selectedEvaluation.feedbacks.map((feedback) => (
                <FeedbackItem key={feedback.feedbackId}>
                  <FeedbackContent><FeedbackTitle>{feedback.title}</FeedbackTitle># {feedback.content}</FeedbackContent>
                  {feedback.materialId && (
                    <LearningMaterialLink onClick={() => handleLearningMaterialClick(feedback.materialId)}>
                      관련 학습자료 확인하러 가기 <ChevronRight size={16} />
                    </LearningMaterialLink>
                  )}
                </FeedbackItem>
              ))}
            </FeedbackList>
            <MoreInfoSection isOpen={isMoreInfoOpen}>
              <MoreInfoHeader onClick={toggleMoreInfo}>
                <MoreInfoTitle>추가 정보</MoreInfoTitle>
                <ToggleButton>
                  {isMoreInfoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </ToggleButton>
              </MoreInfoHeader>
              <MoreInfoContent>
                {selectedEvaluation.moreInfo && selectedEvaluation.moreInfo !== "" 
                  ? selectedEvaluation.moreInfo 
                  : "추가 정보가 없습니다."}
              </MoreInfoContent>
            </MoreInfoSection>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}