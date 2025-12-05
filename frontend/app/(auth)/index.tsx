import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getUser } from '../storage/userStorage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser();
      if (user) router.replace('../(tabs)');
      else router.replace('/(auth)/login');
    };
    checkUser();
  }, []);

  return null;
}
