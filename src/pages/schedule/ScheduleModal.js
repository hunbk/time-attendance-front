import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Modal,
  Snackbar,
  Alert,
} from '@mui/material';
// components
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import USERLIST from '../../_mock/privilege';

const ScheduleModal = ({open, close, editUserId}) => {
    const [editedUserData, setEditedUserData] = useState({
        // 여기에 사용자 정보 관련 상태 변수들을 초기화하세요 (id, name, depart 등)
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUserData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      const handleClose = () => {
        
      }
    
      return (
        <Modal open={open} onClose={close}>
          <div>
            <Typography variant="h6">사용자 정보 수정</Typography>
           
            {/* 필요한 다른 입력 필드들 추가 */}
            <Button variant="contained">
              저장
            </Button>
            <Button variant="outlined">
              취소
            </Button>
          </div>
        </Modal>
      );

};

export default ScheduleModal;
