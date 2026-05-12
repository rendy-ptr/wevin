import { API_BASE_URL } from '@/lib/axios';

export const API_URL = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    ME: `${API_BASE_URL}/api/auth/me`,
    LOGIN_PAGE: `${API_BASE_URL}/login`,
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
  },
  BENEFIT: {
    GET: `${API_BASE_URL}/api/benefit`,
    CREATE: `${API_BASE_URL}/api/benefit`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/benefit/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/benefit/${id}`,
    INDEX: `${API_BASE_URL}/dashboard/admin/benefit`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/api/benefit/${id}`,
  },
};
