import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { PropTypes } from 'prop-types';
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
  Modal,
} from '@mui/material';

const UploadTable = ({ data, deleteFile, confirmUpload }) => {
  return (
    data ? 
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell scope="row">File name</TableCell>
              <TableCell scope="row">{data.name}</TableCell>
              <TableCell scope="row">
                <Button onClick={deleteFile} color="error" variant="contained" component="label">
                      Delete
                </Button>
              </TableCell>
              <TableCell scope="row">
                <Button onClick={confirmUpload} color="success" variant="contained" component="label">
                      Confirm
                </Button>
                  </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          </TableBody>
        </Table>
      </TableContainer>
      :
      null
    );
  }

UploadTable.prototype = {
    data: PropTypes.any,
    deleteFile: PropTypes.func,
    confirmUpload: PropTypes.func
}

export default UploadTable