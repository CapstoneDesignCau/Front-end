import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [enlargedPhoto, setEnlargedPhoto] = useState(null);
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const dummyPhotos = [
      { id: 1, url: '/picture1.webp' },
      { id: 2, url: '/picture2.jpeg' },
      { id: 3, url: '/picture3.avif' },
      { id: 4, url: '/picture4.avif' },
      { id: 5, url: '/picture5.avif' },
      { id: 6, url: '/picture6.avif' },
      { id: 7, url: '/picture7.avif' },
      { id: 8, url: '/picture8.avif' },
      { id: 9, url: '/picture9.jpeg' },
      { id: 10, url: '/picture10.jpeg' },
      { id: 11, url: '/picture11.jpeg' },
      { id: 12, url: '/picture12.avif' },
      { id: 13, url: '/picture13.avif' },
      { id: 14, url: '/picture14.avif' },
      { id: 15, url: '/picture15.avif' },
      { id: 16, url: '/picture16.avif' },
    ];
    setPhotos(dummyPhotos);

    setDateRange({
      start: '2024-11-04',
      end: '2024-11-10'
    });

    // 예시 통계 데이터 (실제로는 API에서 가져와야 함)
    const dummyStats = {};
    dummyPhotos.forEach(photo => {
      dummyStats[photo.id] = `${Math.floor(Math.random() * 100)}/${Math.floor(Math.random() * 1000)}`;
    });
    setStatistics(dummyStats);
  }, []);

  const selectPhoto = useCallback((photo) => {
    setSelectedPhotos(prev => [...prev, photo]);
    setCurrentRound(prev => {
      const newRound = prev + 1;
      if (newRound === 4) {
        setShowResult(true);
      }
      return newRound;
    });
  }, []);

  const getCurrentPair = useCallback(() => {
    const shuffled = [...photos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }, [photos]);

  const getRankedPhotos = useCallback(() => {
    const ranked = [...selectedPhotos, ...photos.filter(p => !selectedPhotos.includes(p))];
    return ranked.slice(0, 16);
  }, [selectedPhotos, photos]);

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
                  선택 비율: {statistics[enlargedPhoto.id]}
                </StatisticsOverlay>
              </ModalContent>
            </Modal>
          )}
        </AnimatePresence>
      </Container>
    );
  }

  const currentPair = getCurrentPair();

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