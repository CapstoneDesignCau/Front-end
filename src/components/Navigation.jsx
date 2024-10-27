import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #282c34;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

function Navigation() {
  return (
    <NavBar>
      <Logo>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Char 칵
        </Link>
      </Logo>
      <NavLinks>
        <Link to="/photo/feedback">사진피드백</Link>
        <Link to="/photo/upload">사진 업로드</Link>
        <Link to="/learning">학습자료</Link>
        <Link to="/community">커뮤니티</Link>
        <Link to="/user/profile">
          <ProfileImage src="/default_1.jpg" alt="User Profile" />
        </Link>
        <Link to="/login">로그인/로그아웃</Link>
      </NavLinks>
    </NavBar>
  );
}

export default Navigation;
