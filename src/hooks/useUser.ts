import { useContext } from 'react';

import { UserContext } from 'contexts/user';

function useUser() {
  const user = useContext(UserContext);

  if (!user) {
    throw new Error(
      'You must call `useUser` within the of the `UserProvider`.'
    );
  }

  return user;
}

export default useUser;
