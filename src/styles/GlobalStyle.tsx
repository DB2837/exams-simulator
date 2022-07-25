import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
*,*::after,*::before {
  /* -webkit-appearance: none; */
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: /* 'Anek Malayalam', */ 'Roboto', sans-serif;
  font-size:1rem + 1vw;
}

body { 
  min-height: 100vh;
  color: #e4e6eb;
  background-color: #131313;
  position: relative;
 

  a:-webkit-any-link {
  text-decoration: none;
  color: white;
  cursor: pointer;
}
  
}


/* body { 
  min-height: 100vh;
  color: #e4e6eb;
  background-color: #131313;
  position: relative;

  a:-webkit-any-link {
  text-decoration: none;
  color: white;
  cursor: pointer;
}
  
}  */

`;
