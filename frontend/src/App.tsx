import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// 導入導航欄組件
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

// 導入頁面組件
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// 導入所有頁面組件
import ElectionList from './pages/ElectionList';
import ElectionDetail from './pages/ElectionDetail';
import CreateElection from './pages/CreateElection';
import Profile from './pages/Profile';

// 導入狀態存儲
import useUserStore from './stores/userStore';

function App() {
  // 獲取用戶狀態
  const { checkAuth } = useUserStore();
  
  // 在應用程序加載時檢查認證狀態
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="container mx-auto py-8 px-4">
          <Routes>
            {/* 公共路由 */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/elections" element={<ElectionList />} />
            <Route path="/elections/:id" element={<ElectionDetail />} />
            
            {/* 受保護路由（需要登入） */}
            <Route path="/create-election" element={
              <ProtectedRoute>
                <CreateElection />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* 未匹配路由重定向到首頁 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
