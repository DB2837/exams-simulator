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
  questionsArr.map((v) => {
    if (v.correctAnswer === v.userPick) {
      score++;
    }
  });

  return score;
};

const clearUserPicks = (questionsArr: TQuestion[]) => {
  questionsArr.map((v) => (v.userPick = ''));
};

const pathsOptions = {
  antropology: 'data/antropologia.json',
  methodology: 'data/metodologia.json',
  pedagogy: 'data/pedagogia.json',
  psicology: 'data/psicologia.json',
};

const questionNum = {
  'exam(30)': 30,
  all: undefined,
};

const errorMode = {
  hide: false,
  show: true,
};

type pathKeys = keyof typeof pathsOptions;
type questionNumKeys = keyof typeof questionNum;
type errorModeKeys = keyof typeof errorMode;

const categoryOptions = Object.keys(pathsOptions);
const questionNumOptions = Object.keys(questionNum);
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

  useEffect(() => {
    (async () => {
      const questions = await fetch(pathsOptions[`${selectedCategory}`]).then(
        (res) => res.json()
      );

      setData(() =>
        shuffleArray(questions.category).slice(
          0,
          questionNum[`${selectedQuestionsNum}`]
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

  const totalScore = useRef(0);

  const handleStartSimulation = () => {
    clearUserPicks(data);
    setData(() => shuffleArray(data));
    setIsSimulationStarted(true);
    setIsSimulationFinished(false);
    setDisplayTotalScore(false);
    setQuestionNumber(0);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const handleEndSimulation = () => {
    totalScore.current = calculateScore(data);
    setDisplayTotalScore(true);
    setIsSimulationFinished(true);
  };

  const handleDecrementQuestionNum = () => {
    if (questionNumber <= 0) return;
    setQuestionNumber((prev) => prev - 1);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const handleIncrementQuestionNum = () => {
    if (questionNumber >= data.length - 1) return;
    setQuestionNumber((prev) => prev + 1);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
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
                      showErrMode={errorMode[`${selectedErrMode}`]}
                      isSimulationFinished={isSimulationFinished}
                      setUserPick={setData}
                      displayTotalScore={displayTotalScore}
                      handleIncrementQuestionNum={handleIncrementQuestionNum}
                    />
                  );
                })
                .slice(questionNumber, questionNumber + 1)}

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
              {displayTotalScore && (
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
