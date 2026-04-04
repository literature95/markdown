import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/client';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await login(username, password);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/');
      } else {
        await register(username, password, email);
        setIsLogin(true);
        setError('注册成功！请登录。');
        setUsername('');
        setPassword('');
        setEmail('');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center page-container px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[60%] h-[80%] bg-gradient-to-br from-[#0071e3]/10 to-[#005bb5]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[20%] w-[50%] h-[60%] bg-gradient-to-tr from-[#5856d6]/10 to-[#0071e3]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-[400px] animate-slide-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#005bb5] mb-6 shadow-lg shadow-[#0071e3]/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight mb-2">
            {isLogin ? '欢迎回来' : '创建账户'}
          </h1>
          <p className="text-[15px] text-[#86868b]">
            {isLogin ? '登录以继续使用 MarkShare' : '注册后开始使用 MarkShare'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#d2d2d7]/30 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-2">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="输入用户名"
                required
              />
            </div>

            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-[13px] font-medium text-[#1d1d1f] mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="输入邮箱地址"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="输入密码"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="animate-fade-in bg-[#fff5f5] border border-[#ff3b30]/20 rounded-lg px-4 py-3">
                <p className="text-[13px] text-[#ff3b30]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-11 text-[15px] font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  处理中...
                </div>
              ) : (
                isLogin ? '登录' : '注册'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#e5e5e5] text-center">
            <p className="text-[14px] text-[#86868b]">
              {isLogin ? '还没有账户？' : '已有账户？'}
              <button
                onClick={toggleMode}
                className="ml-1 text-[#0071e3] font-medium hover:text-[#0077ed] transition-colors"
              >
                {isLogin ? '立即注册' : '立即登录'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-[12px] text-[#86868b] mt-6">
          登录即表示同意我们的{' '}
          <button className="text-[#0071e3] hover:underline">服务条款</button>
          {' '}和{' '}
          <button className="text-[#0071e3] hover:underline">隐私政策</button>
        </p>
      </div>
    </div>
  );
}

export default Login;
