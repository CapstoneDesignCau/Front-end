import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getUploadedImages } from '../api/imageEvaluationService';
import { setRccToken } from '../api/axios';
import useUserStore from '../store/userStorage';

const GridContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Courier New', Courier, monospace;
`;

const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 20px;
  background-color: #000;
  border-radius: 8px;
  position: relative;

  &::before, &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 15px;
    background-image: 
      linear-gradient(
        to right,
        #fff 0px,
        #fff 12px,
        transparent 12px,
        transparent 25px
      );
    background-size: 25px 100%;
    background-repeat: repeat-x;
    z-index: 1;
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }
`;

const GridItem = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 75%;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const Photo = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DateLabel = styled.div`
  position: absolute;
  bottom: 5px;
  left: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  z-index: 2;
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 1px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  background-color: #4a4a4a;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Courier New', Courier, monospace;

  &:hover {
    background-color: #5a5a5a;
  }

  &:disabled {
    background-color: #333;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  margin: 0 1rem;
  font-family: 'Courier New', Courier, monospace;
`;

const Modal = styled.div`
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

const ModalContent = styled.div`
  max-width: 90%;
  max-height: 90%;
  position: relative;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }
`;

export default function MyPhotos() {
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const { accessToken } = useUserStore();
  const photosPerPage = 9;

  useEffect(() => {
    if (accessToken === null) {
      alert("학습자료를 확인하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setRccToken(accessToken);

    const fetchPhotos = async () => {
      try {
        const response = await getUploadedImages(currentPage, photosPerPage);
        if (response.data.isSuccess) {
          setPhotos(response.data.result.content);
          setTotalPages(response.data.result.totalPages);
        } else {
          throw new Error("Failed to fetch photos");
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        alert("사진을 불러오는데 실패했습니다. 다시 시도해 주세요.");
      }
    };

    fetchPhotos();
  }, [accessToken, navigate, currentPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: '2-digit', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '.');
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <GridContainer>
      <Title>MY PHOTOS</Title>
      <GridView>
        {photos.map((photo) => (
          <GridItem key={photo.id} onClick={() => handlePhotoClick(photo)}>
            <Photo src={photo.evaluationImage.fileUrl} alt={photo.evaluationImage.fileName} />
            <DateLabel>{formatDate(photo.createdAt)}</DateLabel>
          </GridItem>
        ))}
      </GridView>
      <PaginationContainer>
        <PageButton 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} 
          disabled={currentPage === 0}
        >
          <ChevronLeft size={16} />
        </PageButton>
        <PageInfo>{currentPage + 1} / {totalPages}</PageInfo>
        <PageButton 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))} 
          disabled={currentPage === totalPages - 1}
        >
          <ChevronRight size={16} />
        </PageButton>
      </PaginationContainer>
      {selectedPhoto && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalImage src={selectedPhoto.evaluationImage.fileUrl} alt={selectedPhoto.evaluationImage.fileName} />
            <CloseButton onClick={handleCloseModal}>
              <X size={20} />
            </CloseButton>
          </ModalContent>
        </Modal>
      )}
    </GridContainer>
  );
}