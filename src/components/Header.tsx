import styled from 'styled-components';

const Header = () => {
  return (
    <HeaderContainer>
      <h1>Exam-Simulator</h1>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  padding: 1rem;
  height: 5vh;
  min-height: 90px;
  text-align: center;
  /*  min-height: 90px; */
`;
