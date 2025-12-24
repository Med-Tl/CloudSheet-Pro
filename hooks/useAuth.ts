
import { useAuthContext } from '../app/Providers';
import { authService } from '../features/auth/auth.service';
import { LoginParams, RegisterParams } from '../features/auth/auth.types';

export const useAuth = () => {
  const context = useAuthContext();

  const login = async (params: LoginParams) => {
    return await authService.login(params);
  };

  const register = async (params: RegisterParams) => {
    return await authService.register(params);
  };

  const logout = async () => {
    return await authService.logout();
  };

  return {
    ...context,
    login,
    register,
    logout,
  };
};
