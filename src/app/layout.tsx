import { redirect } from 'next/navigation';

export default function RootLayout() {
  // Redirigir al locale por defecto
  redirect('/es');
}
