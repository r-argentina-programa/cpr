import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    html{
        margin: 0;
        padding: 0;
    }
    #root{
        min-height: 100vh;
    }
    h1,h2,h3,h4,h5,div{
        font-family: 'Roboto', sans-serif;
    }
`;
