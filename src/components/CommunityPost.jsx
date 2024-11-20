import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ThumbsUp, MessageSquare, Paperclip, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useUserStore from '../store/userStorage';
import { setRccToken } from '../api/axios';
import { getPost, deletePost } from '../api/postService';
import { likePost, likeComment } from '../api/likeService';
import { createComment, deleteComment } from '../api/commentService';

const PostContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PostTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const PostContent = styled.div`
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const PostStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const FileItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ImageContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 2rem;
  width: 100%;
`;

const AttachedImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
  max-height: 400px;
`;

const SliderArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  color: white;
`;

const CommentSection = styled.div`
  margin-top: 2rem;
`;

const CommentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CommentItem = styled.li`
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CommentContent = styled.p`
  margin-bottom: 0.5rem;
`;

const CommentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #c53030;
  }

  &:disabled {
    background-color: #e2e8f0;
    color: #a0aec0;
    cursor: not-allowed;
  }
`;

const BlueButton = styled(Button)`
  background-color: #3182ce;

  &:hover {
    background-color: #2c5282;
  }
`;

const LikeButton = styled(Button)`
  background-color: ${(props) => (props.liked ? "#3182ce" : "#e2e8f0")};
  color: ${(props) => (props.liked ? "white" : "#4a5568")};

  &:hover {
    background-color: ${(props) => (props.liked ? "#2c5282" : "#cbd5e0")};
  }

  &:disabled {
    background-color: ${(props) => (props.liked ? "#2c5282" : "#e2e8f0")};
    color: ${(props) => (props.liked ? "white" : "#a0aec0")};
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CommentForm = styled.form`
  display: flex;
  margin-top: 1rem;
  gap: 1rem;
`;

const CommentInput = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #e53e3e;
  margin-top: 2rem;
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const isImageFile = (extension) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  return imageExtensions.includes(extension.toLowerCase());
};

const CommunityPost = () => {
  const [post, setPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { accessToken, nickname, profileImageUrl, role } = useUserStore();
  const { postId } = useParams();

  const fetchPost = async () => {
    try {
      const response = await getPost(postId);
      if (response.data.isSuccess) {
        setPost(response.data.result);
      } else {
        throw new Error(response.data.message || "Failed to fetch post");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("게시물을 불러오는데 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!postId) {
      setError("게시물 ID가 제공되지 않았습니다.");
      setIsLoading(false);
      return;
    }

    if (accessToken === null) {
      alert("커뮤니티를 확인하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setRccToken(accessToken);
    fetchPost();
  }, [postId, accessToken, navigate]);

  const handleLike = async () => {
    if (post.isLikedByUser) return;

    try {
      const response = await likePost(postId);
      if (response.data.isSuccess) {
        setPost((prevPost) => ({
          ...prevPost,
          likeCount: prevPost.likeCount + 1,
          isLikedByUser: true,
        }));
      } else {
        throw new Error(response.data.message || "Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      alert("게시물 좋아요에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const commentCreateRequestDto = {
      postId: parseInt(postId),
      content: newComment,
    };

    try {
      const response = await createComment(commentCreateRequestDto);
      if (response.data.isSuccess) {
        const newCommentId = response.data.result;
        const currentTime = new Date().toISOString();
        
        const newCommentObj = {
          id: newCommentId,
          content: newComment,
          writerNickname: nickname,
          isDeleted: false,
          likeCount: 0,
          createdAt: currentTime,
          userProfileUrl: profileImageUrl || "/placeholder.svg?height=40&width=40",
          isLikedByUser: false,
        };

        setPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, newCommentObj],
          commentCount: prevPost.commentCount + 1,
        }));
        setNewComment("");

        fetchPost();
      } else {
        throw new Error(response.data.message || "Failed to create comment");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("댓글 작성에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(commentId);
      if (response.data.isSuccess) {
        setPost((prevPost) => ({
          ...prevPost,
          comments: prevPost.comments.filter((comment) => comment.id !== commentId),
          commentCount: prevPost.commentCount - 1,
        }));
      } else {
        throw new Error(response.data.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("댓글 삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        const response = await deletePost(postId);
        if (response.data.isSuccess) {
          alert("게시글이 성공적으로 삭제되었습니다.");
          navigate("/community");
        } else {
          throw new Error(response.data.message || "Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("게시글 삭제에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  const handleCommentLike = async (commentId) => {
    const comment = post.comments.find((c) => c.id === commentId);
    if (comment.isLikedByUser) return;

    try {
      const response = await likeComment(commentId);
      if (response.data.isSuccess) {
        setPost((prevPost) => ({
          ...prevPost,
          comments: prevPost.comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likeCount: comment.likeCount + 1,
                  isLikedByUser: true,
                }
              : comment
          ),
        }));
      } else {
        throw new Error(response.data.message || "Failed to like comment");
      }
    } catch (error) {
      console.error("Error liking comment:", error);
      alert("댓글 좋아요에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const canDeletePost = post && (role === 'ADMIN' || post.writerNickname === nickname);
  const canDeleteComment = (comment) => role === 'ADMIN' || comment.writerNickname === nickname;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SliderArrow><ChevronRight size={20} /></SliderArrow>,
    prevArrow: <SliderArrow><ChevronLeft size={20} /></SliderArrow>,
  };

  if (isLoading) {
    return <LoadingMessage>게시물을 불러오는 중...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!post) {
    return <ErrorMessage>게시물을 찾을 수 없습니다.</ErrorMessage>;
  }

  return (
    <PostContainer>
      <PostHeader>
        <PostTitle>{post.title}</PostTitle>
        {canDeletePost && <Button onClick={handleDeletePost}>게시글 삭제</Button>}
      </PostHeader>
      <PostMeta>
        <ProfileImage
          src={post.writerProfileImageUrl}
          alt={post.writerNickname}
        />
        <span>{post.writerNickname}</span>
        <span>{formatDate(post.createdAt)}</span>
      </PostMeta>
      {post.files && post.files.length > 0 && (
        <ImageContainer>
          <Slider {...sliderSettings}>
            {post.files
              .filter((file) => isImageFile(file.extension))
              .map((file, index) => (
                <div key={index}>
                  <AttachedImage src={file.fileUrl} alt={file.fileName} />
                </div>
              ))}
          </Slider>
        </ImageContainer>
      )}
      <PostContent>{post.content}</PostContent>
      <PostStats>
        <LikeButton onClick={handleLike} liked={post.isLikedByUser} disabled={post.isLikedByUser}>
          <ThumbsUp size={18} />
          <span>{post.likeCount}</span>
        </LikeButton>
        <StatItem>
          <MessageSquare size={18} />
          <span>{post.commentCount}</span>
        </StatItem>
      </PostStats>
      {post.files && post.files.length > 0 && (
        <FileList>
          {post.files
            .filter((file) => !isImageFile(file.extension))
            .map((file, index) => (
              <FileItem key={index}>
                <Paperclip size={18} />
                <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                  {file.fileName}
                </a>
              </FileItem>
            ))}
        </FileList>
      )}
      <CommentSection>
        <h2>댓글 ({post.commentCount})</h2>
        <BlueButton onClick={() => setShowComments(!showComments)}>
          {showComments ? "댓글 숨기기" : "댓글 보기"}
        </BlueButton>
        {showComments && (
          <>
            <CommentList>
              {post.comments.filter(comment => !comment.isDeleted).map((comment) => (
                <CommentItem key={comment.id}>
                  <CommentHeader>
                    <CommentAuthor>
                      <ProfileImage
                        src={comment.userProfileUrl}
                        alt={comment.writerNickname}
                      />
                      <span>{comment.writerNickname}</span>
                    </CommentAuthor>
                    <span>{formatDate(comment.createdAt)}</span>
                  </CommentHeader>
                  <CommentContent>
                    {comment.content}
                  </CommentContent>
                  <CommentMeta>
                    <LikeButton
                      onClick={() => handleCommentLike(comment.id)}
                      liked={comment.isLikedByUser}
                      disabled={comment.isLikedByUser}
                    >
                      <ThumbsUp size={14} />
                      <span>{comment.likeCount}</span>
                    </LikeButton>
                    {canDeleteComment(comment) && (
                      <Button onClick={() => handleDeleteComment(comment.id)}>
                        삭제
                      </Button>
                    )}
                  </CommentMeta>
                </CommentItem>
              ))}
            </CommentList>
            <CommentForm onSubmit={handleAddComment}>
              <CommentInput
                type="text"
                placeholder="댓글을 입력하세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button type="submit">
                <Send size={18} />
              </Button>
            </CommentForm>
          </>
        )}
      </CommentSection>
    </PostContainer>
  );
};

export default CommunityPost;