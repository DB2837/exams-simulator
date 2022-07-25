import { useState } from 'react';
import styled from 'styled-components';

type TQuestion = {
  id: number;
  question: string;
  userPick: string;
  options: string[];
  correctAnswer: string;
};

type TProps = {
  question: string;
  options: string[];
  userPick: string;
  correctAnswer: string;
  isTrainingMode: boolean;
  id: number;
  setUserPick: React.Dispatch<React.SetStateAction<TQuestion[]>>;
  displayTotalScore: boolean;
};

const QuestionsBox = ({
  question,
  options,
  correctAnswer,
  id,
  userPick,
  isTrainingMode,
  setUserPick,
  displayTotalScore,
}: /*  selectedAnswer, */
TProps) => {
  const updateUserPick = (answer: string) => {
    setUserPick((prev) =>
      prev.map((obj) => {
        if (obj.id === id) {
          return { ...obj, userPick: answer };
        }

        return obj;
      })
    );
  };

  const handleAnswerClick = (answer: string) => {
    /* if (userPick) return; */
    if (displayTotalScore) return;

    /*  if (!userPick && answer === correctAnswer && isTrainingMode) {
      setTotalScore((prev) => prev + 1);
    } */
    updateUserPick(answer);
  };

  return (
    <Section>
      <Title>
        <h3>{question}</h3>
      </Title>

      <OptionsContainer>
        {options.map((answer, index) => {
          return (
            <GridCell
              key={index}
              answer={answer}
              onClick={() => handleAnswerClick(answer)}
              userPick={userPick}
              correctAnswer={correctAnswer}
              isCorrectAnswer={correctAnswer === answer}
              isTrainingMode={isTrainingMode}
            >
              {answer}
            </GridCell>
          );
        })}
      </OptionsContainer>
    </Section>
  );
};

export default QuestionsBox;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  /*  border: 2px solid #fff; */
  /*  min-height: 350px; */
  min-width: 320px;
  max-width: 520px;
  border-radius: 6px;
  background-color: #202020;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
  /*  text-align: center; */
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1rem;
`;

const OptionsContainer = styled.div`
  /* display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr; */
  padding: 1rem;
  gap: 12px;

  display: flex;
  flex-direction: column;
`;

type TGridCellProps = {
  /*   selectedAnswer: string; */
  isCorrectAnswer: boolean;
  isTrainingMode: boolean;
  answer: string;
  userPick: string;
  correctAnswer: string;
  /*  isCorrectAnswer: () => boolean; */
};

const GridCell = styled.div<TGridCellProps>`
  background-color: #036668;
  background-color: /* 2px solid */ ${({
    isCorrectAnswer,
    answer,
    isTrainingMode,
    userPick,
    correctAnswer,
  }) => {
    if (isTrainingMode && userPick) {
      return isCorrectAnswer
        ? ` #1ea304`
        : userPick === answer
        ? ` #fc4e41`
        : '#036668';
    } else if (!isTrainingMode) {
      return userPick === answer ? ` #adab25` : '';
    }
  }};

  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0.7rem;
  transition: all 0.2s ease-in-out;

  :hover {
    /*   border: 2px solid #ff7034; */
    transform: scale(1.06);
    /*  transition: border 0.3s; */
  }
`;

/* background-color: #297e4f; */
