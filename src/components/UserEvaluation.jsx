import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { updatePhotoRankCounts, getPhotoRanks } from '../api/photoRankService';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e0e0e0;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background-color: #2ecc71;
`;

const ComparisonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PhotoContainer = styled(motion.div)`
  width: 45%;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Photo = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const VS = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #ff4757;
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DateRange = styled.div`
  align-self: flex-start;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
`;

const WinnerContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
`;

const WinnerTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #2ecc71;
`;

const WinnerPhoto = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const RankingGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;

const RankedPhotoContainer = styled(motion.div)`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const RankedPhoto = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const RankLabel = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 0.9rem;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 80%;
  max-height: 80%;
`;

const EnlargedPhoto = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const StatisticsOverlay = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 1rem;
`;


export default function PhotoOfTheWeek() {
  const [photos, setPhotos] = useState([]);
  const [currentPair, setCurrentPair] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [enlargedPhoto, setEnlargedPhoto] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await getPhotoRanks();
        if (response.data.isSuccess) {
          const fetchedPhotos = response.data.result.map(photo => ({
            id: photo.id,
            url: photo.fileResponse.fileUrl,
            appearanceCount: photo.appearanceCount,
            selectedCount: photo.selectedCount
          }));
          const shuffledPhotos = shuffleArray(fetchedPhotos); // 랜덤으로 사진 셔플
          setPhotos(shuffledPhotos);
          setCurrentPair(shuffledPhotos.slice(0, 2));
        } else {
          throw new Error("Failed to fetch photos");
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        alert("Failed to load photos. Please try again.");
      }
    };

    fetchPhotos();
  }, []);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const selectPhoto = useCallback(async (selectedPhoto) => {
    if (!selectedPhoto || currentPair.length < 2) {
      console.error("Invalid photo or currentPair");
      return;
    }

    const otherPhoto = currentPair.find(p => p.id !== selectedPhoto.id);
    if (!otherPhoto) {
      console.error("Could not find other photo");
      return;
    }

    const photoRankUpdateRequestDto = {
      appearanceIds: [selectedPhoto.id, otherPhoto.id],
      selectedId: selectedPhoto.id
    };

    try {
      await updatePhotoRankCounts(photoRankUpdateRequestDto);
      
      setPhotos(prevPhotos => prevPhotos.map(photo => {
        if (photo.id === selectedPhoto.id) {
          return { ...photo, selectedCount: photo.selectedCount + 1, appearanceCount: photo.appearanceCount + 1 };
        } else if (photo.id === otherPhoto.id) {
          return { ...photo, appearanceCount: photo.appearanceCount + 1 };
        }
        return photo;
      }));

      setSelectedPhotos(prev => [...prev, selectedPhoto]);
      setCurrentRound(prev => {
        const newRound = prev + 1;
        if (newRound === 4) {
          setShowResult(true);
        } else {
          const nextPairIndex = newRound * 2;
          setCurrentPair(photos.slice(nextPairIndex, nextPairIndex + 2));
        }
        return newRound;
      });
    } catch (error) {
      console.error("Error updating photo ranks:", error);
      alert("Failed to update photo selection. Please try again.");
    }
  }, [currentPair, photos]);

  const getRankedPhotos = useCallback(() => {
    return [...photos].sort((a, b) => {
      const ratioA = a.appearanceCount === 0 ? 0 : a.selectedCount / a.appearanceCount;
      const ratioB = b.appearanceCount === 0 ? 0 : b.selectedCount / b.appearanceCount;
      return ratioB - ratioA;
    });
  }, [photos]);

  const handlePhotoClick = (photo) => {
    setEnlargedPhoto(photo);
  };

  const closeModal = () => {
    setEnlargedPhoto(null);
  };

  if (showResult) {
    const rankedPhotos = getRankedPhotos();
    return (
      <Container>
        <Title>이주의 베스트 포토</Title>
        <ResultContainer>
          <DateRange>
            {dateRange.start} ~ {dateRange.end}
          </DateRange>
          <WinnerContainer>
            <WinnerTitle>🏆 이주의 1등 사진</WinnerTitle>
            <WinnerPhoto src={rankedPhotos[0].url} alt="1st place" />
          </WinnerContainer>
          <RankingGrid>
            {rankedPhotos.map((photo, index) => (
              <RankedPhotoContainer
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handlePhotoClick(photo)}
              >
                <RankedPhoto src={photo.url} alt={`Rank ${index + 1}`} />
                <RankLabel>{index + 1}위</RankLabel>
              </RankedPhotoContainer>
            ))}
          </RankingGrid>
        </ResultContainer>
        <AnimatePresence>
          {enlargedPhoto && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <ModalContent onClick={(e) => e.stopPropagation()}>
                <EnlargedPhoto src={enlargedPhoto.url} alt={`Enlarged photo ${enlargedPhoto.id}`} />
                <StatisticsOverlay>
                  선택 비율: {`${enlargedPhoto.selectedCount}/${enlargedPhoto.appearanceCount}`}
                </StatisticsOverlay>
              </ModalContent>
            </Modal>
          )}
        </AnimatePresence>
      </Container>
    );
  }

  return (
    <Container>
      <Title>이주의 사진 선택</Title>
      <ProgressBarContainer>
        <AnimatePresence>
          <ProgressBar
            key={currentRound}
            initial={{ width: `${(currentRound / 4) * 100}%` }}
            animate={{ width: `${((currentRound + 1) / 4) * 100}%` }}
            exit={{ width: `${((currentRound + 1) / 4) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
      </ProgressBarContainer>
      <ComparisonContainer>
        {currentPair.map((photo, index) => (
          <React.Fragment key={photo.id}>
            <PhotoContainer
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectPhoto(photo)}
            >
              <Photo src={photo.url} alt={`Photo ${photo.id}`} />
            </PhotoContainer>
            {index === 0 && <VS>VS</VS>}
          </React.Fragment>
        ))}
      </ComparisonContainer>
    </Container>
  );
}