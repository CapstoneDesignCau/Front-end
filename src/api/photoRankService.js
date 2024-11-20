import { API, FORMAPI } from '../api/axios'; // Adjust the import based on your project structure

// 사진 랭크 생성 API
export const createPhotoRank = (photoRankCreateRequestDto, files) => {
    const formData = new FormData();
    formData.append('photoRank', new Blob([JSON.stringify(photoRankCreateRequestDto)], { type: 'application/json' }));
    files.forEach(file => formData.append('files', file));
  
    return FORMAPI.post('/api/photoRank', formData);
  };

// 사진 랭크 업데이트 API
export const updatePhotoRankCounts = (photoRankUpdateRequestDto) => {
  return API.put('/api/photoRank/updateCounts', photoRankUpdateRequestDto);
};

// 오늘 날짜 기준으로 사진 랭크 조회 API
export const getPhotoRanks = () => {
  return API.get('/api/photoRank');
};