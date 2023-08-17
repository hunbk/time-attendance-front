import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableContainer,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import loginAxios from '../../../api/loginAxios';
import CompanyListSearchbar from './CompanyListSearchbar';
import CopyToClipboard from 'react-copy-to-clipboard';
import { enqueueSnackbar } from 'notistack';

export default function CompanyList() {
  // 회사 목록
  const [companies, setCompanies] = useState([]);

  // 페이징
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 검색어
  const [filterName, setFilterName] = useState('');

  const getCompanyList = async () => {
    const res = await loginAxios.get('/api/companies');
    setCompanies(res.data);
  };

  useEffect(() => {
    getCompanyList();
  }, []);

  const handleClickCopyButton = () => {
    enqueueSnackbar('클립보드에 복사되었습니다!', { variant: 'success' });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const filteredCompanies = companies.filter((company) => company.name.includes(filterName));

  const isNotFound = !filteredCompanies.length && !!filterName;

  return (
    <>
      {/* 회사 이름으로 검색 */}
      <CompanyListSearchbar filterName={filterName} onFilterName={handleFilterByName} />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>회사 이름</TableCell>
                <TableCell sx={{ width: '400px' }}>인증 코드</TableCell>
                <TableCell>등록 날짜</TableCell>
                <TableCell>최종 수정 날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompanies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((company) => (
                <TableRow key={company.companyId}>
                  <TableCell>{company.companyId}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {company.code}
                    <CopyToClipboard text={company.code}>
                      <IconButton size="small" aria-label="copy" onClick={handleClickCopyButton}>
                        <ContentCopyIcon />
                      </IconButton>
                    </CopyToClipboard>
                  </TableCell>
                  <TableCell>{company.dateCreated}</TableCell>
                  <TableCell>{company.dateUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>

            {isNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <Paper
                      sx={{
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="h6" paragraph>
                        검색결과가 없습니다.
                      </Typography>

                      <Typography variant="body2">
                        다음 검색에 대한 결과를 찾을 수 없습니다. &nbsp;
                        <strong>&quot;{filterName}&quot;</strong>.
                        <br /> 회사의 이름을 다시 한번 확인해주세요.
                      </Typography>
                    </Paper>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredCompanies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
