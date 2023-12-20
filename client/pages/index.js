import axios from "axios";

const LandingPage = ({ currentuser }) => {
  console.log(currentuser)
  axios.get('/api/users/currentuser')
    return <h1>Landing Page</h1>;
};

// LandingPage.getInitialProps = async () => {
//   const response = await axios.get('/api/users/currentuser')
//   console.log('I am on the server!');

//   return response.data;
// }
   
export default LandingPage;