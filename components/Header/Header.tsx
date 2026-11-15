import { getUser } from '@/lib/api/server-api';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const user = await getUser();
  return <HeaderClient initialUser={user} />;
}
