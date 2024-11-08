import { API } from './axios';

// 게시글 좋아요 저장 API
export const likePost = (postId) => API.post(`/api/like/post/${postId}`);

// 게시글 좋아요 취소 API
export const cancelLikePost = (postId) => API.patch(`/api/like/post/${postId}`);

// 댓글 좋아요 저장 API
export const likeComment = (commentId) => API.post(`/api/like/comment/${commentId}`);

// 댓글 좋아요 취소 API
export const cancelLikeComment = (commentId) => API.patch(`/api/like/comment/${commentId}`);