import React, { SyntheticEvent, useState } from 'react';
import styled from 'styled-components';

type TDropDownMenuProps = {
  title: string;
  options: string[];
  setSelectedOption: React.Dispatch<React.SetStateAction<any>>;
};

const DropDownMenu = ({
  title,
  options,
  setSelectedOption,
}: TDropDownMenuProps) => {
  const [displaySelector, setDisplaySelector] = useState<boolean>(true);
  /*  const [value, setValue] = useState<string>(options[0]); */

  const handleClick = (e: any) => {
    setSelectedOption(() => e.target.value);
    console.log(e.target.value);
    /*  console.log(e.target.value); */
  };

  return (
    <Container displaySelector={displaySelector}>
      <label htmlFor={title}>{title}</label>
      <MenuSelector
        /*  defaultValue={options[0]} */

        onClick={handleClick}
      >
        {options.map((option, index) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </MenuSelector>
    </Container>
  );
};

export default DropDownMenu;

const MenuSelector = styled.select``;

type TOptionsContainerProps = {
  displaySelector: boolean;
};

const Container = styled.div<TOptionsContainerProps>`
  display: ${({ displaySelector }) => {
    return displaySelector ? 'flex' : 'none';
  }};
  flex-direction: column;
  text-align: center;
  margin-right: 0.8rem;
  margin-left: 0.8rem;
`;

const OptionsContainer = styled.div<TOptionsContainerProps>`
  position: absolute;
  min-width: 70px;
  top: 300%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: ${({ displaySelector }) => {
    return displaySelector ? 'flex' : 'none';
  }};
  flex-direction: column;
  padding: 0.5rem;
  background-color: #323232;
`;

const Select = styled.select`
  border-bottom: 1px solid #fff;
  margin-top: 6px;
  width: 100%;
`;
