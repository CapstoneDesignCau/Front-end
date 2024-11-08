import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HighlightsContainer = styled.section`
  background-color: #f8f9fa;
  padding: 2rem;
  margin: 2rem 0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const HighlightsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const HighlightItem = styled.li`
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const HighlightLink = styled(Link)`
  text-decoration: none;
  color: #333;
  display: block;
`;

const HighlightTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const HighlightMeta = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const CommunityHighlights = () => {
  const highlights = [
    { id: 1, title: "최고의 포즈 팁 공유", author: "포즈마스터", comments: 42, link: "/community/post/1" },
    { id: 2, title: "야외 촬영 노하우", author: "자연광러버", comments: 38, link: "/community/post/2" },
    { id: 3, title: "셀프 촬영 꿀팁 모음", author: "셀카여신", comments: 55, link: "/community/post/3" },
  ];

  return (
    <HighlightsContainer>
      <Title>커뮤니티 하이라이트</Title>
      <HighlightsList>
        {highlights.map((highlight) => (
          <HighlightItem key={highlight.id}>
            <HighlightLink to={highlight.link}>
              <HighlightTitle>{highlight.title}</HighlightTitle>
              <HighlightMeta>
                작성자: {highlight.author} | 댓글: {highlight.comments}
              </HighlightMeta>
            </HighlightLink>
          </HighlightItem>
        ))}
      </HighlightsList>
    </HighlightsContainer>
  );
};

export default CommunityHighlights;