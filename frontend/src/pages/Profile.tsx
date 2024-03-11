import { useMutation } from '@tanstack/react-query';
import BaseTemplate from '@/components/template/PageTemplate';
import { Button } from '@/components/atoms';
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '@/utils/auth';
import useAuthStore from '@/hooks/useAuthStore';

function Profile() {
  const navigate = useNavigate();
  const { user, resetUser } = useAuthStore((state) => ({
    user: state.user,
    resetUser: state.logout,
  }));

  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
  });

  useEffect(() => {
    if (logoutMutation.isSuccess) {
      resetUser();
      navigate('/');
    }
  }, [logoutMutation.isSuccess, resetUser, navigate]);

  return (
    <BaseTemplate>
      <div className="mx-auto max-w-64 mt-8">
        <h1 className="text-2xl font-bold text-teal-400 dark:text-teal-300">
          {user?.name}
        </h1>
      </div>
      <NavLink
        to="/"
        className="block text-lg font-bold text-center mt-10 py-3 px-6 rounded border border-gray-100 bg-gray-50 dark:bg-gray-600 dark:border-gray-500 w-fit mx-auto mb-5"
      >
        Retourner au jeu
      </NavLink>
      <Button
        type="button"
        onClick={() => logoutMutation.mutate()}
        className="mt-12 text-gray-400 dark:text-gray-300"
      >
        Se déconnecter
      </Button>
    </BaseTemplate>
  );
}

export default Profile;
