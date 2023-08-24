import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const AuthStateContext = createContext({
  authenticated: false,
  user: undefined,
  loading: true,
});

const AuthDispatchContext = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      return {
        ...state,
        authenticated: false,
        user: undefined,
      };
    case 'STOP_LOADING':
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [state, defaultDispatch] = useReducer(reducer, {
    user: userInfo || undefined, // 로컬스토리지에 사용자 정보가 있으면 저장, 없으면 undefined
    authenticated: !!accessToken && !!userInfo, // 로컬스토리지에 토큰, 사용자 정보가 있으면 true, 없으면 false
    loading: true,
  });

  const dispatch = (type, payload) => {
    defaultDispatch({ type, payload });
  };

  // TODO: 로그인 한 사용자의 정보를 새로고침 시, 받아올려고 시도하였지만 현재는 실패함.
  // useEffect(() => {
  //   console.log('mount');
  //   async function loadUser() {
  //     try {
  //       const res = await loginAxios.get('/api/users/me');
  //       dispatch('LOGIN', res.data);
  //     } catch (error) {
  //       dispatch('LOGOUT');
  //     } finally {
  //       dispatch('STOP_LOADING');
  //     }
  //   }
  //   loadUser();
  // }, []);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
