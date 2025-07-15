/**
 * 受保護路由組件
 * 用於保護需要登入才能訪問的路由
 */
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useUserStore from '../stores/userStore';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, user, checkAuth, isLoading } = useUserStore();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    
    verifyAuth();
  }, [checkAuth]);

  // 如果正在檢查認證狀態，顯示載入中
  if (isChecking || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 如果未登入，重定向到登入頁面
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果需要管理員權限但用戶不是管理員，重定向到首頁
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 如果已登入且有足夠權限，顯示子組件
  return <>{children}</>;
};

export default ProtectedRoute;
