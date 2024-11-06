import { API, FORMAPI } from './axios';

// 이미지 리스트들 평가 생성 API
export const createImageEvaluations = (imageFiles) => {
  const formData = new FormData();
  imageFiles.forEach((file, index) => {
    formData.append(`images[${index}]`, file);
  });
  return FORMAPI.post('/api/imageEvaluation', formData);
};

// 특정 이미지 평가 조회 API
export const getImageEvaluation = (id) => API.get(`/api/imageEvaluation/${id}`);

// 최근 5개의 이미지 평가 조회 API
export const getRecentImageEvaluations = () => API.get('/api/imageEvaluation/list/recent');

// 평가를 요청한 모든 이미지 목록 조회 API
export const getAllImageEvaluations = () => API.get('/api/imageEvaluation/list/all');