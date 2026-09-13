import React from 'react';
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
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <Container>
      <label htmlFor={title}>{title}</label>
      <MenuSelector id={title} value={selectedOption} onChange={handleChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </MenuSelector>
    </Container>
  );
};

export default DropDownMenu;

const MenuSelector = styled.select`
  font-weight: inherit;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-right: 0.8rem;
  margin-left: 0.8rem;
  font-weight: bold;
`;
