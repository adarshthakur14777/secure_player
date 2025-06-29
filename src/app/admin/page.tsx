import { AuthGuard } from '@/components/admin/auth-guard';
import AdminDashboard from '@/components/admin/dashboard';

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminDashboard />
    </AuthGuard>
  );
}
