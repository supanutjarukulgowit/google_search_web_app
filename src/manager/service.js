import axios from "axios";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const mySwal = withReactContent(Swal)
const api = axios.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 15000
  })
function customFetch(options) {
    return new Promise((resolve) => {
        console.log(options);
        api
        .request(options)
        .then(response => {
        resolve({
            response: response.data.data
        })
        })
        .catch(error => {
          let errResponse = error.response? error.response:{};
          let statusCodeResponse = errResponse.status? errResponse.status:0;
          let bodyResponse = errResponse.data ? errResponse.data:0;
          if(statusCodeResponse === 401 || statusCodeResponse === 400){
            if(bodyResponse === 0){
              mySwal.fire({
                icon: 'error',
                title: 'ERROR_500',
                text: 'server error',
              })
            }else{
              mySwal.fire({
                icon: 'error',
                title: bodyResponse.error.code,
                text: bodyResponse.error.messageToUser,
              })
            }
          }else{
            mySwal.fire({
              icon: 'error',
              title: 'ERROR_500',
              text: 'server error',
            })
          }
        });
    })
}

const Fetch = {
    customFetch
}
export default Fetch;