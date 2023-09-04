import axios from 'axios';

// 서버로 요청을 보내는것과 서버에서 받은 응답을 화면(컴포넌트)단에서 처리하기전에 추가로직을 넣을수 있는 API
const loginAxios = axios.create({
  baseURL: 'http://localhost:8080', // API의 기본 URL을 설정합니다.
});

// 요청 인터셉터. 요청을 보내기 전에 헤더를 토큰 설정.
loginAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터. 응답을 받은 후, 에러 처리.
loginAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 토큰이 만료되거나 유효하지 않은 경우 로그아웃 로직 처리
      // 토큰, 사용자 정보 제거
      localStorage.removeItem('accessToken');

      // TODO: 알림 방식 개선
      alert('인증이 만료되었습니다. 다시 로그인해 주세요.');

      // 리다이렉션
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default loginAxios;
