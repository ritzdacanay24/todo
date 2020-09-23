import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
  .todo-header-logo img {
    width:40px;
    position:absolute;
    top:-5px;
  }
  
  header.login {
    padding-top: 10rem;
    padding-bottom: calc(34.1rem - 4.5rem);
    background: linear-gradient(to bottom, rgba(92, 77, 66, 0.6) 0%, rgba(92, 77, 66, 0.6) 100%), url("https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260");
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: scroll;
    background-size: cover;
    overflow-y:hidden
  }
  
  nav.navbar {
    background-color: rgba(0, 0, 0, 0.6) !important; 
  }
`;

export default GlobalStyle;