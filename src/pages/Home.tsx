import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import QuestionsBox from '../components/QuestionsBox';
import { shuffleArray } from '../utils/shuffleArray';
import DropDownMenu from '../components/DropDownMenu';
import { getQuestions } from '../utils/getQuestions';

type TQuestion = {
  id: number;
  question: string;
  userPick: string;
  options: string[];
  correctAnswer: string;
};

const calculateScore = (questionsArr: TQuestion[]) => {
  let score = 0;
  questionsArr.map((v) => {
    if (v.correctAnswer === v.userPick) {
      score++;
    }
  });

  return score;
};

const setPath = (value: string) => {
  if (value === 'methodology') {
    return 'src/data/metodologia.json';
  }

  return 'src/data/antropologia.json';
};

const setQuestionsNum = (value: string) => {
  if (value === 'exam(30)') {
    return 30;
  }
};

const setErrMode = (value: string) => {
  if (value === 'hide') {
    return false;
  }

  return true;
};

const Home = () => {
  const [data, setData] = useState<TQuestion[]>([]);

  const [selectedCategory, setSelectedCategory] = useState('antropology');
  const [selectedQuestionsNum, setSelectedQuestionsNum] = useState('exam(30)');
  const [selectedErrMode, setSelectedErrMode] = useState('show');

  console.log(setErrMode(selectedErrMode));

  useEffect(() => {
    (async () => {
      const questions = await getQuestions(setPath(selectedCategory));
      setData(() =>
        shuffleArray(questions.category).slice(
          0,
          setQuestionsNum(selectedQuestionsNum)
        )
      );
    })();
  }, [selectedCategory, selectedQuestionsNum]);

  const [isSimulationStarted, setIsSimulationStarted] =
    useState<boolean>(false);
  const [isSimulationFinished, setIsSimulationFinished] =
    useState<boolean>(false);
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [displayTotalScore, setDisplayTotalScore] = useState<boolean>(false);
  const [showErrMode, setShowErrMode] = useState<boolean>(() =>
    setErrMode(selectedErrMode)
  );
  const totalScore = useRef(0);

  const handleStartSimulation = () => {
    setData(() => shuffleArray(data));
    setIsSimulationStarted(true);
    setIsSimulationFinished(false);
    setDisplayTotalScore(false);
    setShowErrMode(() => setErrMode(selectedErrMode)); //get this value true or false from localStorage
    setQuestionNumber(0);
  };

  const handleEndSimulation = () => {
    totalScore.current = calculateScore(data);
    setShowErrMode(true);
    setDisplayTotalScore(true);
    setIsSimulationFinished(true);
  };

  const handleDecrementQuestionNum = () => {
    if (questionNumber <= 0) return;
    setQuestionNumber((prev) => prev - 1);
  };

  const handleIncrementQuestionNum = () => {
    if (questionNumber >= data.length - 1) return;
    setQuestionNumber((prev) => prev + 1);
  };

  return (
    <>
      <MenuContainer>
        {!isSimulationStarted && (
          <>
            {' '}
            <DropDownMenu
              title='category'
              options={['antropology', 'methodology']}
              setSelectedOption={setSelectedCategory}
            />
            <DropDownMenu
              title='questions'
              options={['exam(30)', 'all']}
              setSelectedOption={setSelectedQuestionsNum}
            />
            <DropDownMenu
              title='erros'
              options={['show', 'hide']}
              setSelectedOption={setSelectedErrMode}
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

        {isSimulationStarted && (
          <>
            <div>
              <QuestionNumContainer>
                <h3>
                  {questionNumber + 1} / {data.length}
                </h3>
              </QuestionNumContainer>
              {data
                .map((v) => {
                  return (
                    <QuestionsBox
                      key={v.id}
                      id={v.id}
                      question={v.question}
                      options={v.options}
                      correctAnswer={v.correctAnswer}
                      userPick={v.userPick}
                      showErrMode={showErrMode}
                      isSimulationFinished={isSimulationFinished}
                      setUserPick={setData}
                      displayTotalScore={displayTotalScore}
                    />
                  );
                })
                .slice(questionNumber, questionNumber + 1)}

              <ButtonContaier>
                <FaLongArrowAltLeft
                  onClick={handleDecrementQuestionNum}
                  style={arrowStyle}
                />

                {/*   <StyledButton>end simulation</StyledButton> */}

                <FaLongArrowAltRight
                  onClick={handleIncrementQuestionNum}
                  style={arrowStyle}
                />
              </ButtonContaier>
              {displayTotalScore && (
                <ScoreContainer>
                  total score: {totalScore.current} / {data.length}{' '}
                </ScoreContainer>
              )}
            </div>
            {!isSimulationFinished && (
              <StyledButton onClick={handleEndSimulation}>
                end simulation
              </StyledButton>
            )}
            {isSimulationFinished && (
              <StyledButton onClick={() => setIsSimulationStarted(false)}>
                start new simulation
              </StyledButton>
            )}
          </>
        )}
      </MainContainer>
    </>
  );
};

export default Home;

const arrowStyle = {
  fontSize: '3rem',
  marginRight: '20px',
  marginLeft: '20px',
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
