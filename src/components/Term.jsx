import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const TermsContainer = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
`;

const TermsSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #444;
  margin-bottom: 10px;
`;

const TermsText = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #666;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0051cc;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

function TermsAgreement() {
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [allAgreed, setAllAgreed] = useState(false);
  const navigate = useNavigate();

  const handleAllAgree = (e) => {
    setAllAgreed(e.target.checked);
    setTermsAgreed(e.target.checked);
    setPrivacyAgreed(e.target.checked);
  };

  const handleIndividualAgree = () => {
    setAllAgreed(termsAgreed && privacyAgreed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (termsAgreed && privacyAgreed) {
      alert("모든 약관에 동의하셨습니다. 회원가입을 진행합니다.");
      navigate("/user/signup"); // /user/signup 경로로 이동
    }
  };

  return (
    <PageContainer>
      <Title>이용약관 동의</Title>
      <form onSubmit={handleSubmit}>
        <TermsContainer>
          <TermsSection>
            <SectionTitle>제1조(목적)</SectionTitle>
            <TermsText>
              본 약관은 캡char주식회사(이하 "회사"라 칭함)에서 운영하는 캡char
              홈페이지와 패밀리사이트 (이하 "홈페이지"라 칭함)의 서비스 이용 및
              제공에 관한 제반 사항의 규정을 목적으로 합니다.
            </TermsText>
          </TermsSection>

          <TermsSection>
            <SectionTitle>제2조(용어의 정의)</SectionTitle>
            <TermsText>
              ① "홈페이지"란 회사가 컴퓨터 등 정보통신설비를 이용하여 재화 또는
              용역을 이용자에게 제공하고 거래할 수 있도록 설정한 가상의 영업장을
              말하며, 아울러 홈페이지를 운영하는 사업자의 의미로도 사용합니다.
              <br />
              ② "이용자"란 "홈페이지"에 접속하여 이 약관에 따라 "홈페이지"가
              제공하는 서비스를 받는 회원 및 비회원을 말합니다.
              <br />
              ③ "회원"이라 함은 "홈페이지"에 개인정보를 제공하여 회원등록을 한
              자로서, "홈페이지"의 정보를 지속적으로 제공받으며 "홈페이지"가
              제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
              <br />
              ④ "비회원"이라 함은 회원에 가입하지 않고 "홈페이지"가 제공하는
              서비스를 이용하는 자를 말합니다.
              <br />⑤ "게시물"이라 함은 회원이 홈페이지를 이용함에 있어서
              홈페이지에 게시한 부호,문자,음성,음향,화상,동영상 등의 정보 형태의
              글,사진,동영상 및 각종 파일과 링크 등을 의미합니다.
            </TermsText>
          </TermsSection>

          <TermsSection>
            <SectionTitle>제3조(약관의 효력 및 변경)</SectionTitle>
            <TermsText>
              ① 본 약관은 "홈페이지"의 서비스 화면(www.samsungfire.com)에
              게시하거나 이용자에게 공지함으로써 효력이 발생합니다.
              <br />
              ② 홈페이지는 불가피한 여건이나 사정이 있을 경우 약관을 변경할 수
              있으며 변경할 경우, 적용일자 및 개정사유를 명시하여 현행약관과
              함께 "홈페이지"의 초기화면에 7일 이전부터 적용일자 전까지
              공지합니다. 단, 회원에게 불리한 약관의 개정인 경우에는 공지 외에
              회사가 부여한 이메일 주소로(회원이 "홈페이지"에 제출한 전자우편
              주소) 개정약관을 발송하여 통지해야 합니다.
              <br />③ "홈페이지"가 전항에 따라 개정약관을 공지 또는 통지 하면서
              회원에게 7일 기간 내에 의사표시를 하지 않으면 의사표시가 표명된
              것으로 본다는 뜻을 명확하게 따로 공지 또는 통지 하였음에도 회원이
              명시적으로 거부의사를 표시하지 아니한 경우 회원이 개정 약관에
              동의한 것으로 봅니다.
            </TermsText>
          </TermsSection>

          <TermsSection>
            <SectionTitle>제4조(회원가입)</SectionTitle>
            <TermsText>
              ① 이용자는 "홈페이지"가 정한 양식에 따라 회원정보를 기입한 후 본
              약관에 동의함으로써 회원으로 가입됩니다.
              <br />
              ② 전자금융거래를 이용하려는 회원은 반드시 본인의 이름과
              주민등록번호 혹은 본인인증 정보를 제공하여야만 서비스를 이용할 수
              있으며, 실명으로 등록하지 않을 경우에는 일체의 회원으로서의 권리를
              주장할 수 없습니다.
              <br />
              ③ 타인의 명의(이름 및 주민등록번호)를 도용하여 가입 신청을 한
              회원의 모든 ID는 삭제되며, 관계법령에 따라 처벌을 받을 수
              있습니다.
              <br />
              ④ "홈페이지"는 회원가입신청 이용자 중 다음 각 호에 해당하지 않는
              한 회원으로 등록하여야 합니다. ◦ 가입신청자가 본 약관 제5조 제2항
              제1호 내지 제4호에 의거 이전에 회원자격을 상실한 적이 있는 경우 ◦
              등록내용에 허위, 기재누락, 오기가 있는 경우 ◦ 만 14세 미만인 경우
              ◦ 기타 회원으로 등록하는 것이 "홈페이지"의 기술상 현저히 지장이
              있다고 판단되는 경우 <br />⑤ 회원은 가입 시 등록한 회원정보의
              변경이 발생한 경우, 즉시 "홈페이지"에서 직접 수정 또는 전자우편,
              기타 방법으로 "홈페이지"에 그 변경 사실을 알려야 합니다.
            </TermsText>
          </TermsSection>

          <TermsSection>
            <SectionTitle>제5조(회원 탈퇴 및 자격 상실)</SectionTitle>
            <TermsText>
              ① 회원은 "홈페이지"에 언제든지 탈퇴를 요청할 수 있으며, 이 경우
              "홈페이지"는 즉시 회원탈퇴를 처리를 합니다.
              <br />
              ② 회원이 다음 각 호의 사유에 해당하는 경우, "홈페이지"는
              회원자격을 상실(제한·정지)시킬 수 있습니다. ◦ 가입 신청시 허위
              내용을 기재한 경우 ◦ 다른 사람의 "홈페이지" 이용을 방해하거나 그
              정보를 도용하는 등 를 위협하는 경우 ◦ "홈페이지"를 이용하여 법령과
              이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우
              <br />
              ③ 타인의 명의(이름 및 주민등록번호)를 도용하여 가입 신청을 한
              회원의 모든 ID는 삭제되며, 관계법령에 따라 처벌을 받을 수
              있습니다.
              <br />
              ④ "홈페이지"는 회원가입신청 이용자 중 다음 각 호에 해당하지 않는
              한 회원으로 등록하여야 합니다. ◦ 가입신청자가 본 약관 제5조 제2항
              제1호 내지 제4호에 의거 이전에 회원자격을 상실한 적이 있는 경우 ◦
              등록내용에 허위, 기재누락, 오기가 있는 경우 ◦ 만 14세 미만인 경우
              ◦ 기타 회원으로 등록하는 것이 "홈페이지"의 기술상 현저히 지장이
              있다고 판단되는 경우 <br />⑤ 회원은 가입 시 등록한 회원정보의
              변경이 발생한 경우, 즉시 "홈페이지"에서 직접 수정 또는 전자우편,
              기타 방법으로 "홈페이지"에 그 변경 사실을 알려야 합니다.
            </TermsText>
          </TermsSection>
        </TermsContainer>

        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={termsAgreed}
            onChange={(e) => {
              setTermsAgreed(e.target.checked);
              handleIndividualAgree();
            }}
          />
          이용약관에 동의합니다.
        </CheckboxLabel>

        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={privacyAgreed}
            onChange={(e) => {
              setPrivacyAgreed(e.target.checked);
              handleIndividualAgree();
            }}
          />
          개인정보 처리방침에 동의합니다.
        </CheckboxLabel>

        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={allAgreed}
            onChange={handleAllAgree}
          />
          모든 약관에 동의합니다.
        </CheckboxLabel>

        <SubmitButton type="submit" disabled={!termsAgreed || !privacyAgreed}>
          동의하고 가입하기
        </SubmitButton>
      </form>
    </PageContainer>
  );
}

export default TermsAgreement;
