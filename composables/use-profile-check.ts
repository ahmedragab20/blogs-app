export default function () {
  const user = useCurrentUser()?.value;

  function profileCheck(fn: Function): void {
    //TODO:: Create global function that handles this case throughout the app
    if (!user) {
      return;
    }

    fn?.();
  }
}
