import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import QuestionsBox from '../components/QuestionsBox';
import { shuffleArray } from '../utils/shuffleArray';
import DropDownMenu from '../components/DropDownMenu';

type TQuestion = {
  id: number;
  question: string;
  userPick: string;
  options: string[];
  correctAnswer: string;
};

const calculateScore = (questionsArr: TQuestion[]) => {
  let score = 0;
  questionsArr.forEach((v) => {
    if (v.correctAnswer === v.userPick) {
      score++;
    }
  });

  return score;
};

const clearUserPicks = (questionsArr: TQuestion[]) => {
  questionsArr.forEach((v) => (v.userPick = ''));
};

const pathsOptions = {
  antropology: 'src/data/antropologia.json',
  methodology: 'src/data/metodologia.json',
  pedagogy: 'src/data/pedagogia.json',
  psicology: 'src/data/psicologia.json',
};

const totalQuestionNum = {
  all: undefined,
  'exam(30)': 30,
};

const errorMode = {
  show: true,
  hide: false,
};

type pathKeys = keyof typeof pathsOptions;
type questionNumKeys = keyof typeof totalQuestionNum;
type errorModeKeys = keyof typeof errorMode;

const categoryOptions = Object.keys(pathsOptions);
const questionNumOptions = Object.keys(totalQuestionNum);
const errorModeOptions = Object.keys(errorMode);

const Home = () => {
  const bottomRef = useRef<any>(null);
  const [data, setData] = useState<TQuestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    categoryOptions[0] as pathKeys
  );
  const [selectedQuestionsNum, setSelectedQuestionsNum] = useState(
    questionNumOptions[0] as questionNumKeys
  );
  const [selectedErrMode, setSelectedErrMode] = useState(
    errorModeOptions[0] as errorModeKeys
  );
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(0);
  const [isSimulationStarted, setIsSimulationStarted] =
    useState<boolean>(false);
  const [isSimulationFinished, setIsSimulationFinished] =
    useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const questions = await fetch(pathsOptions[`${selectedCategory}`]).then(
        (res) => res.json()
      );

      setData(() =>
        questions.category.slice(0, totalQuestionNum[`${selectedQuestionsNum}`])
      );
    })();
  }, [selectedCategory, selectedQuestionsNum]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bottomRef.current, currentQuestionNumber, isSimulationStarted]);

  const totalScore = useRef(0);

  const handleStartSimulation = () => {
    clearUserPicks(data);
    setData(() => shuffleArray(data));
    setIsSimulationStarted(true);
    setIsSimulationFinished(false);
    setCurrentQuestionNumber(0);
  };

  const handleEndSimulation = () => {
    totalScore.current = calculateScore(data);
    setIsSimulationFinished(true);
  };

  const handleDecrementQuestionNum = () => {
    if (currentQuestionNumber <= 0) return;
    setCurrentQuestionNumber((prev) => prev - 1);
  };

  const handleIncrementQuestionNum = () => {
    if (currentQuestionNumber >= data.length - 1) return;
    setCurrentQuestionNumber((prev) => prev + 1);
  };

  return (
    <>
      <MenuContainer>
        {!isSimulationStarted && (
          <>
            {' '}
            <DropDownMenu
              title='category'
              options={categoryOptions}
              selectedOption={selectedCategory}
              setSelectedOption={setSelectedCategory}
            />
            <DropDownMenu
              title='questions'
              options={questionNumOptions}
              setSelectedOption={setSelectedQuestionsNum}
              selectedOption={selectedQuestionsNum}
            />
            <DropDownMenu
              title='erros'
              options={errorModeOptions}
              setSelectedOption={setSelectedErrMode}
              selectedOption={selectedErrMode}
            />
          </>
        )}
      </MenuContainer>
      <MainContainer>
        {!isSimulationStarted && (
          <>
            <StyledButton onClick={handleStartSimulation}>
              start simulation
            </StyledButton>
          </>
        )}

        {!isSimulationFinished && isSimulationStarted && (
          <StyledButton onClick={handleEndSimulation}>
            end simulation
          </StyledButton>
        )}
        {isSimulationFinished && isSimulationStarted && (
          <StyledButton onClick={() => setIsSimulationStarted(false)}>
            start new simulation
          </StyledButton>
        )}

        {isSimulationStarted && data && (
          <>
            <div>
              <QuestionNumContainer>
                <h3>
                  {currentQuestionNumber + 1} / {data.length}
                </h3>
              </QuestionNumContainer>
              {
                <QuestionsBox
                  id={data[currentQuestionNumber].id}
                  question={data[currentQuestionNumber].question}
                  options={data[currentQuestionNumber].options}
                  correctAnswer={data[currentQuestionNumber].correctAnswer}
                  userPick={data[currentQuestionNumber].userPick}
                  showErrMode={errorMode[`${selectedErrMode}`]}
                  isSimulationFinished={isSimulationFinished}
                  setUserPick={setData}
                  handleIncrementQuestionNum={handleIncrementQuestionNum}
                />
              }

              <ButtonContaier>
                <FaLongArrowAltLeft
                  onClick={handleDecrementQuestionNum}
                  style={arrowStyle}
                />

                <FaLongArrowAltRight
                  onClick={handleIncrementQuestionNum}
                  style={arrowStyle}
                />
              </ButtonContaier>
              {isSimulationFinished && (
                <ScoreContainer>
                  total score: {totalScore.current} / {data.length}{' '}
                </ScoreContainer>
              )}
            </div>
          </>
        )}
      </MainContainer>
      <BottomDiv ref={bottomRef} />
    </>
  );
};

export default Home;

const BottomDiv = styled.div`
  border: 2px solid #131313;
`;

const arrowStyle = {
  fontSize: '3.2rem',
  marginRight: '45px',
  marginLeft: '45px',
  cursor: 'pointer',
};

const MenuContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0.6rem;
`;

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: fit-content;
  min-height: 450px;
  padding: 1rem;
  margin: 1rem 0;
  /*  border: 2px solid #fff; */
`;

const ButtonContaier = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  margin-top: 10px;
  width: 100%;
`;

const ScoreContainer = styled.div`
  text-align: center;
  padding: 1rem;
  font-size: 18px;
`;

const QuestionNumContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 1rem;
`;

const StyledButton = styled.button`
  min-width: 92px;
  padding: 0.6rem;
  margin-left: 0.4rem;
  border: 2px solid #fff;
  background: none;
  color: #fff;
  font-size: inherit;
  font-weight: 700;

  :hover {
    border: 2px solid #036668;
    transition: border 0.3s;
  }
`;
