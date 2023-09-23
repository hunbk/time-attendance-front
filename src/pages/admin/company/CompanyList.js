import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import CompanyListSearchbar from './CompanyListSearchbar';
import CopyToClipboard from 'react-copy-to-clipboard';
import { enqueueSnackbar } from 'notistack';
import SettlementModal from './SettlementModal';

CompanyList.propTypes = {
  companies: PropTypes.array,
};

export default function CompanyList({ companies }) {
  const [showSettlementModal, setShowSettlementModal] = useState(false);

  // 페이징
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 검색어
  const [filterName, setFilterName] = useState('');

  // 회사 아이디
  const [companyId, setCompanyId] = useState(null);

  const handleClickSettlementButton = (companyId) => {
    setShowSettlementModal(true);
    setCompanyId(companyId);
  };

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
      {/* 회사명으로 검색 */}
      <CompanyListSearchbar filterName={filterName} onFilterName={handleFilterByName} />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 600 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '20px' }}>ID</TableCell>
                <TableCell sx={{ width: '100px' }}>회사 로고</TableCell>
                <TableCell sx={{ width: '100px' }}>회사명</TableCell>
                <TableCell sx={{ width: '210px' }}>인증 코드</TableCell>
                <TableCell sx={{ width: '20px' }}>정산</TableCell>
                <TableCell sx={{ width: '100px' }}>등록 날짜</TableCell>
                <TableCell sx={{ width: '100px' }}>최종 수정 날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompanies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((company) => (
                <TableRow key={company.companyId}>
                  <TableCell>{company.companyId}</TableCell>
                  <TableCell>
                    {company.logoUrl ? (
                      <div
                        style={{
                          width: '80px',
                          height: '30px',
                          background: `url(http://localhost:8080/images/${company.logoUrl}) no-repeat center center`,
                          backgroundSize: 'contain',
                        }}
                      />
                    ) : (
                      company.logoUrl
                    )}
                  </TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>
                    {company.code}
                    <CopyToClipboard text={company.code}>
                      <IconButton size="small" aria-label="copy" onClick={handleClickCopyButton}>
                        <ContentCopyIcon />
                      </IconButton>
                    </CopyToClipboard>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      aria-label="copy"
                      onClick={() => handleClickSettlementButton(company.companyId)}
                    >
                      <CalculateOutlinedIcon />
                    </IconButton>
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
                        {filterName} 회사를 찾지 못했습니다.
                      </Typography>

                      <Typography variant="body2">
                        {filterName} 회사에 대한 정보가 없습니다. &nbsp;
                        <br /> 다시 한번 회사의 이름을 확인해주세요.
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
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredCompanies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="페이지당 목록 수 :"
        labelDisplayedRows={({ count }) => `현재 페이지: ${page + 1} / 전체 페이지: ${Math.ceil(count / rowsPerPage)}`}
      />

      <SettlementModal
        companyId={companyId}
        open={showSettlementModal}
        onClose={() => {
          setCompanyId(null);
          setShowSettlementModal(false);
        }}
      />
    </>
  );
}
