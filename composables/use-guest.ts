import { useAuthStore } from '~/stores/auth';
export default function () {
  const authStore = useAuthStore();
  const user = useCurrentUser()?.value;

  function clickHandler(fn: Function): void {
    if (!user) {
      authStore.chooseAuthLand('login');
      authStore.toggleAuthLanded(true);

      return;
    }

    fn?.();
  }

  return {
    clickHandler,
  };
}
