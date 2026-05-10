import { getRedirectPath, login, logout } from '@/lib/auth';
import { AuthError, NotFoundError } from '@/lib/errors';
import { authRepository } from '@/repositories/auth.repository';
import bcrypt from 'bcryptjs';

export const authService = {
  login: async (email: string, password: string) => {
    const user = await authRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AuthError('Invalid credentials');
    }

    const redirectPath = getRedirectPath(user.role);

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    await login(sessionUser);

    return { sessionUser, redirectPath };
  },

  logout: async () => {
    await logout();
    return { success: true };
  },
};
