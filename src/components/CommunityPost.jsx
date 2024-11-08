import React, { useState } from "react";
import styled from "styled-components";
import { ThumbsUp, MessageSquare, Trash2, Paperclip, Send } from "lucide-react";

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
`;

const AttachedImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const isImageFile = (fileName) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const extension = fileName.split(".").pop().toLowerCase();
  return imageExtensions.includes(extension);
};

const CommunityPost = () => {
  const [post, setPost] = useState({
    id: 1,
    title: "임시 게시글 제목",
    content:
      "이것은 임시 게시글의 내용입니다. 여기에 실제 게시글 내용이 들어갈 것입니다.",
    writerProfileImageUrl: "/placeholder.svg?height=40&width=40",
    writerNickname: "임시작성자",
    createdAt: "2023-05-20T12:34:56",
    likeCount: 15,
    commentCount: 3,
    files: [
      { name: "첨부파일1.pdf", url: "https://example.com/file1.pdf" },
      { name: "첨부이미지.jpg", url: "https://picsum.photos/800/600" },
    ],
    comments: [
      {
        id: 1,
        writerNickname: "댓글작성자1",
        userProfileUrl: "/placeholder.svg?height=40&width=40",
        content: "첫 번째 댓글입니다.",
        createdAt: "2023-05-20T13:00:00",
        likeCount: 3,
        isDeleted: false,
      },
      {
        id: 2,
        writerNickname: "댓글작성자2",
        userProfileUrl: "/placeholder.svg?height=40&width=40",
        content: "두 번째 댓글입니다.",
        createdAt: "2023-05-20T14:30:00",
        likeCount: 1,
        isDeleted: false,
      },
      {
        id: 3,
        writerNickname: "댓글작성자3",
        userProfileUrl: "/placeholder.svg?height=40&width=40",
        content: "세번째 댓글입니다.",
        createdAt: "2023-05-20T15:45:00",
        likeCount: 0,
        isDeleted: false,
      },
    ],
  });

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setPost((prevPost) => ({
      ...prevPost,
      likeCount: liked ? prevPost.likeCount - 1 : prevPost.likeCount + 1,
    }));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const newCommentObj = {
      id: post.comments.length + 1,
      writerNickname: "현재 사용자",
      userProfileUrl: "/placeholder.svg?height=40&width=40",
      content: newComment,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      isDeleted: false,
    };

    setPost((prevPost) => ({
      ...prevPost,
      comments: [...prevPost.comments, newCommentObj],
      commentCount: prevPost.commentCount + 1,
    }));
    setNewComment("");
  };

  const handleDeleteComment = (commentId) => {
    setPost((prevPost) => ({
      ...prevPost,
      comments: prevPost.comments.map((comment) =>
        comment.id === commentId ? { ...comment, isDeleted: true } : comment
      ),
      commentCount: prevPost.commentCount - 1,
    }));
  };

  const handleDeletePost = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      setIsDeleted(true);
    }
  };

  const handleCommentLike = (commentId) => {
    setPost((prevPost) => ({
      ...prevPost,
      comments: prevPost.comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, likeCount: comment.likeCount + 1 }
          : comment
      ),
    }));
  };

  if (isDeleted) {
    return <PostContainer>이 게시글은 삭제되었습니다.</PostContainer>;
  }

  return (
    <PostContainer>
      <PostHeader>
        <PostTitle>{post.title}</PostTitle>
        <Button onClick={handleDeletePost}>게시글 삭제</Button>
      </PostHeader>
      <PostMeta>
        <ProfileImage
          src={post.writerProfileImageUrl}
          alt={post.writerNickname}
        />
        <span>{post.writerNickname}</span>
        <span>{formatDate(post.createdAt)}</span>
      </PostMeta>
      <PostContent>{post.content}</PostContent>
      <PostStats>
        <LikeButton onClick={handleLike} liked={liked}>
          <ThumbsUp size={18} />
          <span>{post.likeCount}</span>
        </LikeButton>
        <StatItem>
          <MessageSquare size={18} />
          <span>{post.commentCount}</span>
        </StatItem>
      </PostStats>
      {post.files && post.files.length > 0 && (
        <>
          <FileList>
            {post.files
              .filter((file) => !isImageFile(file.name))
              .map((file, index) => (
                <FileItem key={index}>
                  <Paperclip size={18} />
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </FileItem>
              ))}
          </FileList>
          <ImageContainer>
            {post.files
              .filter((file) => isImageFile(file.name))
              .map((file, index) => (
                <AttachedImage key={index} src={file.url} alt={file.name} />
              ))}
          </ImageContainer>
        </>
      )}
      <CommentSection>
        <h2>댓글 ({post.commentCount})</h2>
        <BlueButton onClick={() => setShowComments(!showComments)}>
          {showComments ? "댓글 숨기기" : "댓글 보기"}
        </BlueButton>
        {showComments && (
          <>
            <CommentList>
              {post.comments.map((comment) => (
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
                    {comment.isDeleted ? "삭제된 댓글입니다." : comment.content}
                  </CommentContent>
                  <CommentMeta>
                    <LikeButton
                      onClick={() => handleCommentLike(comment.id)}
                      liked={false}
                    >
                      <ThumbsUp size={14} />
                      <span>{comment.likeCount}</span>
                    </LikeButton>
                    {!comment.isDeleted && (
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
