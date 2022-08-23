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
  showErrMode: boolean;
  id: number;
  isSimulationFinished: boolean;
  setUserPick: React.Dispatch<React.SetStateAction<TQuestion[]>>;
  handleIncrementQuestionNum: () => void;
};

const QuestionsBox = ({
  question,
  options,
  correctAnswer,
  id,
  userPick,
  showErrMode,
  setUserPick,
  handleIncrementQuestionNum,
  isSimulationFinished,
}: TProps) => {
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
    if (isSimulationFinished) return;
    if (userPick && showErrMode) return;

    updateUserPick(answer);
    if (correctAnswer === answer && showErrMode) {
      handleIncrementQuestionNum();
    }
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
              isCorrectAnswer={correctAnswer === answer}
              showErrMode={showErrMode}
              isSimulationFinished={isSimulationFinished}
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
  gap: 20px;

  display: flex;
  flex-direction: column;
`;

type TGridCellProps = {
  /*   selectedAnswer: string; */
  isCorrectAnswer: boolean;
  showErrMode: boolean;
  answer: string;
  userPick: string;
  isSimulationFinished: boolean;
  /*  isCorrectAnswer: () => boolean; */
};

const GridCell = styled.div<TGridCellProps>`
  background-color: #036668;
  background-color: /* 2px solid */ ${({
    isCorrectAnswer,
    answer,
    showErrMode,
    userPick,
    isSimulationFinished,
  }) => {
    /* else if (!showErrMode && isSimulationFinished && userPick) {
      return isCorrectAnswer
        ? ` #1ea304`
        : userPick === answer
        ? ` #fc4e41`
        : '#036668';
    } */ if (!showErrMode && !isSimulationFinished) {
      return userPick === answer ? ` #adab25` : '';
    } else if (showErrMode && !isSimulationFinished && userPick) {
      return isCorrectAnswer
        ? ` #1ea304`
        : userPick === answer
        ? ` #fc4e41`
        : '#036668';
    } else if (isSimulationFinished) {
      return isCorrectAnswer
        ? ` #1ea304`
        : userPick === answer
        ? ` #fc4e41`
        : '#036668';
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
