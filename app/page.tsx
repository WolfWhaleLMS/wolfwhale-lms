import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/login?next=%2Fstudent')
}
