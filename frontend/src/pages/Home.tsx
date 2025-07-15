import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* 英雄區塊 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl shadow-xl overflow-hidden">
        <div className="px-8 py-16 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            安全、透明的區塊鏈投票系統
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            利用區塊鏈技術的不可篡改性和透明性，為各類組織提供安全、高效且可審計的電子投票解決方案。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-lg shadow-md transition duration-300"
            >
              立即註冊
            </Link>
            <Link
              to="/elections"
              className="bg-blue-700 text-white hover:bg-blue-800 px-6 py-3 rounded-lg font-medium text-lg shadow-md transition duration-300"
            >
              瀏覽選舉
            </Link>
          </div>
        </div>
      </div>

      {/* Bento Grid 卡片區 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 特點卡片 1 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">安全可靠</h3>
            <p className="text-gray-600">
              使用區塊鏈技術確保投票數據的不可篡改性，加密技術保護選民的隱私和投票的機密性。
            </p>
          </div>
        </div>

        {/* 特點卡片 2 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">透明可審計</h3>
            <p className="text-gray-600">
              所有投票記錄都存儲在區塊鏈上，可以被公開驗證，同時保護選民的匿名性。
            </p>
          </div>
        </div>

        {/* 特點卡片 3 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">高效便捷</h3>
            <p className="text-gray-600">
              簡化投票流程，節省時間和資源，同時提供即時的計票結果。
            </p>
          </div>
        </div>

        {/* 大卡片：如何使用 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 md:col-span-2">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">如何使用我們的系統</h3>
            <ol className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                <span>註冊帳戶並完成 KYC 身份驗證</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                <span>瀏覽可參與的選舉活動</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                <span>領取加密選票並進行投票</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
                <span>投票結束後查看結果</span>
              </li>
            </ol>
          </div>
        </div>

        {/* 統計卡片 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md overflow-hidden text-white">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">系統數據</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-blue-100 text-sm">活躍選舉</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">已完成選舉</p>
                <p className="text-3xl font-bold">48</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">註冊選民</p>
                <p className="text-3xl font-bold">2,540</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">總投票數</p>
                <p className="text-3xl font-bold">15,280</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 號召行動區塊 */}
      <div className="bg-gray-50 rounded-xl p-8 text-center shadow-inner">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">準備好開始使用了嗎？</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          無論是企業決策、社區投票還是組織選舉，我們的區塊鏈投票系統都能為您提供安全、透明的解決方案。
        </p>
        <Link
          to="/register"
          className="inline-block bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium shadow-md transition duration-300"
        >
          立即註冊
        </Link>
      </div>
    </div>
  );
};

export default Home;
