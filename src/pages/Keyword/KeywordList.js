import 
{ 
  CssBaseline, 
  Box, 
  Container, 
  Typography, 
  Button,  
  Paper,
  Stack,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import DownloadingIcon from '@mui/icons-material/Downloading';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import KeywordTable from './KeywordTable';
import axios from "axios";
import CommonUtils from '../../utils/common';
import _ from 'lodash';
import fileDownload from 'js-file-download';

const KeywordList = () => {
  const [keywords, setKeywords] = useState([]);
  const [loadTemplate, setLoadTemplate] = useState(false);
  const {state} = useLocation();
  const mySwal = withReactContent(Swal)
  const navigate = useNavigate()
  let userId = ""
  if (state) {
    userId = state.userId? state.userId:"";
  }
  useEffect(() => {
    const token = localStorage.getItem('g_search_token')
    if(token === "" || userId === ""){
      mySwal.fire({
        icon: 'error',
        title: 'Invalid Token',          
      }).then(() => {
        navigate('/')
      })
    }else{
      var myHeaders = new Headers();
      myHeaders.append("user_id", userId);
      myHeaders.append("Authorization", "Bearer "+token);
      
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      fetch("http://localhost:8081/api/keywords/list", requestOptions)
        .then(response => response.json())
        .then(result => setKeywords(result.data))
        .catch(error => console.log('error', error));
    }
  }, [])

  const token = localStorage.getItem('g_search_token')

  const api = axios.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization' : "Bearer "+ token
    },
    timeout: 15000
  })

  const downloadTemplate = () => {
      setLoadTemplate(true)
      let options = {
        method: 'GET',
        url: 'http://localhost:8081/api/keywords/download/template',
      }
      api
        .request(options)
        .then(response => {
          const fileName = 'keyword_list.csv'
          const blobData = CommonUtils.b64toBlob(_.get(response.data, 'data.base64', {}))
          fileDownload(blobData, fileName)
          setLoadTemplate(false);
        })
        .catch(error => {
          setLoadTemplate(false)
          console.log(error)
          let errResponse = error.response? error.response:{};
          let statusCodeResponse = errResponse.status? errResponse.status:0;
          let bodyResponse = errResponse.data ? errResponse.data:0;
          console.log(statusCodeResponse);
          if(statusCodeResponse !== 400){
            console.log(bodyResponse);
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
      
  }

  return (
    <>
      <React.Fragment>
        <CssBaseline/>
          <Container maxWidth="lg" sx={{p:2}}>
            <Paper sx={{p:2}}>
              <Box display="flex" sx={{p:2}}>
                <Box sx={{flexGrow : 1}}>
                <Typography variant="h6" gutterBottom component="div">
                Keyword List
                </Typography>
                </Box> 
                <Box>
                <Stack direction="row" spacing={2}>
                <LoadingButton
                  loading={loadTemplate}
                  loadingPosition="start"
                  startIcon={<DownloadingIcon />}
                  variant="outlined"
                  onClick={downloadTemplate}
                >
                  Download Template
                </LoadingButton>
                  <Button variant="contained" component="label">
                    Upload
                    <input hidden accept="image/*" multiple type="file" />
                </Button>
                </Stack>
                </Box>
              </Box>
              <KeywordTable
                {...{
                  data:keywords,
                }}
              />
            </Paper>
          </Container>
      </React.Fragment>
    </>
  );
}

export default KeywordList;