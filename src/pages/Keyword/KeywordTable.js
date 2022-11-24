import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { PropTypes } from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 
{ 
  Button,  
  Paper,
} from '@mui/material';
import { useState } from 'react';

const columns = [
  { name: 'keyword', label: 'Keywords', minWidth: 150 },
  { name: 'ads_words', label: 'Total Ads', minWidth: 100 },
  { name: 'link',label: 'Total Links',minWidth: 100,},
  { name: 'search_results',label: 'Total Results',minWidth: 100,},
  { name: 'time_taken',label: 'Time Taken(s)',minWidth: 100,},
  { name: 'raw_html',label: 'Raw Html',minWidth: 100,},
  { name: 'cache_link',label: 'cache',minWidth: 100,},
  { name: 'created_date',label: 'created date',minWidth: 120,},
];

const KeywordTable = ({ data }) => {
  const mySwal = withReactContent(Swal)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rawHtml, setRawHtml] = useState("")
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const copyHtml = (rawHtml) => {
    setRawHtml(rawHtml)
    mySwal.fire({
      icon: 'success',
      title: 'copy raw html to your clib board',          
    })
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {
            data ? 
            data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.name];
                      if(column.name=== 'raw_html'){
                        return (
                          <TableCell key={column.name + index} align={column.align}>
                            <CopyToClipboard text={rawHtml}>
                            <Button onClick={ () => copyHtml(value)} variant="text" component="label">
                              Copy
                            </Button>
                            </CopyToClipboard>
                          </TableCell>
                        );
                      }else{
                        return (
                          <TableCell key={column.name + index} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                );
              })
            :  
            null
            }   
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length?data.length:0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

KeywordTable.prototype = {
    data: PropTypes.any,
}

export default KeywordTable