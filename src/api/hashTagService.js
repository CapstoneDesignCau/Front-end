import { API } from './axios';

// 해시태그 생성 API
export const createHashtag = (requestDto) => 
  API.post('/api/hashtag', requestDto);

// 모든 해시태그 조회 API
export const getAllHashtags = () => 
  API.get('/api/hashtag');

// 해시태그 검색 API
export const searchHashtags = (keyword) => 
  API.get('/api/hashtag/search', {
    params: { keyword },
  });