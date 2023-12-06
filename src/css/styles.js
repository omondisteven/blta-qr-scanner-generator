import styled, { createGlobalStyle } from "styled-components";
// import styled from "styled-components";

export const GlobalStyle = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

  html {
    height: 100%;
  }

  .container {
    width: 100%;
    max-width: 410px;
    background-color: #ffff;
    padding: 15px 25px;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 0 10px #ffff;
}
 
  body {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2F58CD; 
}

  div#root {
    height: 100%;
  }
`;

export const Root = styled.main`
  display: flex;
  flex-flow: column;
  align-items: center;
  text-align: center;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 50px 0 50px;
`;

export const Result = styled.div`
  width: 320px;
  height: auto;
  white-space: pre-wrap;
  word-break: break-word;
  background-color: #e6e6e6;
  border-radius: 6px;
  padding: 20px 20px 30px;
`;

export const Footer = styled.footer`
  display: flex;
  flex-direction: column;  // Align buttons in a column
  align-items: center;     // Center buttons horizontally
  button {
    width: 100%;             // Make buttons 100% of the container width
    margin-bottom: 10px;    // Add margin between buttons
    border: none;
    outline: none;
    background: grey;
    cursor: pointer;
  }
`;


