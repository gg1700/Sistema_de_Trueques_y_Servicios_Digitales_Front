import { redirect } from 'next/navigation';

export default function paginaPrincipal() {
  redirect('/login');
}