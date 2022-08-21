import React, { SyntheticEvent, useState } from 'react';
import styled from 'styled-components';

type TDropDownMenuProps = {
  title: string;
  options: string[];
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<any>>;
};

const DropDownMenu = ({
  title,
  options,
  selectedOption,
  setSelectedOption,
}: TDropDownMenuProps) => {
  /*  const [value, setValue] = useState<string>(options[0]); */

  const handleChange = (e: any) => {
    setSelectedOption(() => e.target.value);
  };

  return (
    <Container onChange={handleChange}>
      <label htmlFor={title}>{title}</label>
      <MenuSelector defaultValue={selectedOption}>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-right: 0.8rem;
  margin-left: 0.8rem;
`;

/* const OptionsContainer = styled.div`
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
`; */

/* const Select = styled.select`
  border-bottom: 1px solid #fff;
  margin-top: 6px;
  width: 100%;
`;
 */
