import React, { createContext, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import loginAxios from '../api/loginAxios';
import { LinearProgress } from '@mui/material';

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

// 정상적으로 동작하는 코드
// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN':
//       return {
//         authenticated: true,
//         user: action.payload,
//       };
//     case 'LOGOUT':
//       return { authenticated: false, user: null };
//     default:
//       return state;
//   }
// };

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

  useEffect(() => {
    dispatch({ type: 'LOADING' }); // 로딩 시작

    (async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const { data } = await loginAxios.get('/api/users/me');
          if (data) {
            dispatch({ type: 'LOGIN', payload: data });
          } else {
            dispatch({ type: 'LOGOUT' }); // 로그인 실패
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
          dispatch({ type: 'LOGOUT' }); // 에러 발생 시 로그아웃
        }
      } else {
        dispatch({ type: 'LOGOUT' }); // 토큰 없으면 로그아웃
      }
    })();
  }, []);

  // 정상적으로 동작하는 코드(로그인은 유지, 새로고침 시 404 버그 존재)
  // useEffect(() => {
  //   (async () => {
  //     const token = localStorage.getItem('accessToken');
  //     console.log('저장된 토큰:', token); // 토큰 출력
  //     if (token) {
  //       try {
  //         const { data } = await loginAxios.get('/api/users/me');
  //         console.log('서버 응답:', data); // 서버 응답 출력
  //         if (data) {
  //           console.log('dispatch 전'); // dispatch 호출 전 확인
  //           dispatch({ type: 'LOGIN', payload: data });
  //           console.log('dispatch 후'); // dispatch 호출 후 확인
  //         }
  //       } catch (error) {
  //         console.error('Error fetching user info:', error);
  //       }
  //     }
  //   })();
  // }, []);

  // 비정상적인 코드
  // useEffect(() => {
  //   const token = localStorage.getItem('accessToken');
  //   if (token) {
  //     try {
  //       const { data } = loginAxios.get('/api/users/me');
  //       console.log('서버 응답:', data); // 서버 응답 출력
  //       if (data) {
  //         console.log('dispatch 전'); // dispatch 호출 전 확인
  //         dispatch({ type: 'LOGIN', payload: data });
  //         console.log('dispatch 후'); // dispatch 호출 후 확인
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user info:', error);
  //     }
  //   }
  // }, []);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {state.loading ? (
          <LinearProgress color="inherit" /> // 로딩 중일 때
        ) : (
          children // 로딩 완료되면 실제 컨텐츠 표시
        )}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );

  // 정상적인 코드
  // return (
  //   <AuthStateContext.Provider value={state}>
  //     <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
  //   </AuthStateContext.Provider>
  // );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
