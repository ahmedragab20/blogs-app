export default function () {
  const user = useCurrentUser()?.value;

  function profileCheck(fn: Function): void {
    //TODO:: Create global function that handles this case throughout the app
    //? current issue: what if the user reacted without completing the profile?
    //* -> make the update profile mode reusable and pop it up when the user reacts.

    if (!user) {
      return;
    }

    fn?.();
  }
}
