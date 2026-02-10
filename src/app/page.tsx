import { redirect } from 'next/navigation';
import { getSession, getUserRole } from '@/lib/auth';

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const role = await getUserRole();

  if (!role) {
    redirect('/login');
  }

  // Route based on user role
  switch (role) {
    case 'student':
      redirect('/student/dashboard');
    case 'parent':
      redirect('/parent/dashboard');
    case 'teacher':
      redirect('/teacher/dashboard');
    case 'admin':
      redirect('/admin/dashboard');
    case 'super_admin':
      redirect('/admin/dashboard');
    default:
      redirect('/student/dashboard');
  }
}
