import 
{ 
  CssBaseline, 
  Box, 
  Container, 
  Typography, 
  Button,  
  Paper,
  Stack,
  Skeleton,
  CircularProgress,
  Autocomplete,
  TextField
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
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
import UploadTable from './UploadTable';
import Fetch from '../../manager/service';
const KeywordList = () => {  
  const [keywords, setKeywords] = useState([]);
  const [loadTemplate, setLoadTemplate] = useState(false);
  const [loadKeyword, setLoadKeyword] = useState(false);
  const [uploadLoding, setUploadLoding] = useState(false);
  const [file, setFile] = useState(null);
  const {state} = useLocation();
  const mySwal = withReactContent(Swal)
  const handleOpen = () => {
    setFile(null)
    setOpen(true)
  };
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate()
  let userId = ""
  if (state) {
    userId = state.userId? state.userId:"";
  }
  const handleInput  = (e) => {
    setSearch(e.target.value)
  }
  const handleSearch = (e) => {
    if(e.keyCode == 13){
      getKeyword(search)
   }
  }
  const handleRefresh = () => {
    getKeyword("")
    setSearch("")
  }
  const getKeyword = (keyword) => {
    setLoadKeyword(true)
      let med = ""
      let url = ""
      if(keyword) {
        med = 'POST'
        url = 'http://localhost:8081/api/keywords/search'
      }else{
        med = 'GET'
        url = 'http://localhost:8081/api/keywords/list'
      }
      let request = {
        keyword: keyword,
      }
      let options = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization' : "Bearer "+ token,
          'user_id' : userId
        },
        method: med,
        url
      }
      if(keyword){
        options.data = request
      }
    Fetch.customFetch(options).then((result) => {
        setKeywords(result.response)
        setLoadKeyword(false)
    })
  }
  useEffect(() => {
    const token = localStorage.getItem('g_search_token')
    if(!token || token === "" || !userId || userId === ""){
      mySwal.fire({
        icon: 'error',
        title: 'Invalid Token',          
      }).then(() => {
        navigate('/')
      })
    }else{
      getKeyword("")
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
          let errResponse = error.response? error.response:{};
          let statusCodeResponse = errResponse.status? errResponse.status:0;
          let bodyResponse = errResponse.data ? errResponse.data:0;
          if(statusCodeResponse !== 400){
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

  const onUploadFile = (e) => {
    setFile(null)
    if(e.target.files[0].type !== "text/csv"){
      mySwal.fire({
        icon: 'error',
        title: 'invalid file type',
        text: 'only csv file is available',
      })
    }else{
      setFile(e.target.files[0])
    }
  }
  const deleteFile = () => {
    setFile(null)
  }
  const confirmUpload = () => {
    setFile(null)
    setUploadLoding(true)
    var bodyFormData = new FormData();
    bodyFormData.append('user_id', userId);
    bodyFormData.append('files', file);
    let options = {
      method: 'POST',
      url: 'http://localhost:8081/api/keywords/upload/file',
      data: bodyFormData
    }
    const api = axios.create({
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization' : "Bearer "+ token
      },
      timeout: 60000
    })
    api
      .request(options)
      .then(response => {
        setUploadLoding(false)
        console.log(response);
      }).then(() => {
        getKeyword("")
      })
      .catch(error => {
        setUploadLoding(false)
        let errResponse = error.response? error.response:{};
        let statusCodeResponse = errResponse.status? errResponse.status:0;
        let bodyResponse = errResponse.data ? errResponse.data:0;
        if(statusCodeResponse === 400 || statusCodeResponse === 401){
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
                <Button onClick={handleRefresh} color="warning" variant="contained" component="label">
                      Refresh
                  </Button>
                  <LoadingButton
                    color="secondary"
                    loading={loadTemplate}
                    loadingPosition="start"
                    startIcon={<DownloadingIcon />}
                    variant="outlined"
                    onClick={downloadTemplate}
                    disabled={!downloadTemplate}
                  >
                    Download Template
                  </LoadingButton>
                  
                    <Button disabled={uploadLoding} onClick={handleOpen} variant="contained" component="label">
                      Upload
                      <input hidden type="file" onChange={onUploadFile}/>
                  </Button>
                  {
                    uploadLoding? 
                      <CircularProgress />
                    :
                      null
                  }
                  
                </Stack>
                <TextField
                        label="Search"
                        sx={{marginTop:1}}
                        fullWidth
                        onChange={handleInput}
                        onKeyDown={handleSearch}
                        value={search}
                />
                </Box>
              </Box>
              
              {
                  file ? 
                  <Box sx={{flexGrow : 1, paddingBottom:2}}>
                    <UploadTable
                    {
                      ...{
                        data:file,
                        deleteFile,
                        confirmUpload
                      }
                    }
                    />
                  </Box>
                    :
                  null
              }
              { 
              loadKeyword ? 
              <Skeleton variant="rounded" height={190} /> 
              : 
                <KeywordTable
                {
                  ...{data:keywords,}
                }
                />
              }
            </Paper>
          </Container>
      </React.Fragment>
    </>
  );
}

export default KeywordList;