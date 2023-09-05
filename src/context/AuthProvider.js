import React, { createContext, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import loginAxios from '../api/loginAxios';
import { Box, CircularProgress, LinearProgress } from '@mui/material';

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: action.payload,
        loading: false, // 로딩 완료
      };
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        user: null,
        loading: false, // 로딩 완료
      };
    case 'LOADING':
      return {
        ...state,
        loading: true, // 로딩 시작
      };
    default:
      return state;
  }
};

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
};

export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (!context) {
    throw new Error('useAuthDispatch must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    authenticated: false,
    user: null,
    loading: true, // 초기 로딩 상태를 true로 설정
  });

  // 서버에서 사용자 정보를 요청하는 API
  const fetchUserData = async () => {
    dispatch({ type: 'LOADING' }); // 로딩 시작

    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const { data } = await loginAxios.get('/api/users/me');
        if (data) {
          dispatch({ type: 'LOGIN', payload: data });
        } else {
          dispatch({ type: 'LOGOUT' }); // 인증 실패
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        dispatch({ type: 'LOGOUT' }); // 에러 발생 시 로그아웃
      }
    } else {
      dispatch({ type: 'LOGOUT' }); // 토큰이 없으면 로그아웃
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {state.loading ? (
          // 로딩 중일 때
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress color="primary" />
          </Box>
        ) : (
          // 로딩 완료되면 실제 컨텐츠 표시
          children
        )}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
