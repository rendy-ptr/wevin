import { API_BASE_URL } from '@/lib/axios';

export const API_URL = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    ME: `${API_BASE_URL}/api/auth/me`,
    LOGIN_PAGE: `${API_BASE_URL}/login`,
    SESSION: `${API_BASE_URL}/api/auth/session`,
  },
  MEMBER: {
    GET: `${API_BASE_URL}/api/member`,
    CREATE: `${API_BASE_URL}/api/member`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/member/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/member/${id}`,
    INDEX: `${API_BASE_URL}/dashboard/admin/member`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/member/edit/${id}`,
  },
  PACKAGE: {
    GET: `${API_BASE_URL}/api/package`,
    CREATE: `${API_BASE_URL}/api/package`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/package/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/package/${id}`,
    INDEX: `${API_BASE_URL}/dashboard/admin/package`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/package/edit/${id}`,
    GET_ACTIVE: `${API_BASE_URL}/api/package/active`,
  },
  BENEFIT: {
    GET: `${API_BASE_URL}/api/benefit`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/benefit/${id}`,
  },
  TEMPLATE: {
    GET: `${API_BASE_URL}/api/template`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/template/${id}`,
  },
  ACTIVITY: {
    GET: `${API_BASE_URL}/api/activity`,
  },
  SETTING: {
    GET: `${API_BASE_URL}/api/setting`,
    UPDATE_PASSWORD: (id: number) =>
      `${API_BASE_URL}/api/setting/password/${id}`,
    UPDATE_EMAIL: (id: number) => `${API_BASE_URL}/api/setting/email/${id}`,
    UPDATE_NAME: (id: number) => `${API_BASE_URL}/api/setting/name/${id}`,
    GET_ALL_ACTIVITY_LOGS: `${API_BASE_URL}/api/setting/logs`,
    SEND_OTP: `${API_BASE_URL}/api/setting/send-otp`,
  },
};
