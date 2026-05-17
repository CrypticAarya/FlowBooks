import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

export default function Login() {
  const onFinish = (values) => {
    console.log('Login submitted:', values);
    // Dynamic simulated login transition
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4 font-sans antialiased animate-fade-in">
      
      {/* Centered Login Card */}
      <div className="w-full max-w-[390px] bg-[#121214] border border-zinc-850 rounded-2xl p-8 md:p-10 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2.5">
          <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-black font-extrabold text-xl shadow-lg shadow-white/5">
            F
          </div>
          <h1 className="font-display font-bold text-lg tracking-tight text-white mt-1">
            FlowBooks
          </h1>
          <p className="text-xs text-zinc-450 leading-relaxed max-w-[260px]">
            Enter your credentials to log in to your billing and financial dashboard.
          </p>
        </div>

        {/* Ant Design Form Wrapper */}
        <Form
          name="flowbooks_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          className="flex flex-col gap-4 mt-2"
        >
          {/* Email Form Input */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
              <Input 
                prefix={<MailOutlined className="text-zinc-550 mr-1.5" />} 
                placeholder="you@example.com" 
                style={{ 
                  backgroundColor: '#18181b', 
                  borderColor: '#27272a',
                  color: 'white',
                  borderRadius: '8px',
                  height: '40px',
                  fontSize: '12px'
                }}
              />
            </div>
          </Form.Item>

          {/* Password Form Input */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
            style={{ marginBottom: '12px' }}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Password</label>
              <Input.Password 
                prefix={<LockOutlined className="text-zinc-550 mr-1.5" />} 
                placeholder="••••••••" 
                style={{ 
                  backgroundColor: '#18181b', 
                  borderColor: '#27272a',
                  color: 'white',
                  borderRadius: '8px',
                  height: '40px',
                  fontSize: '12px'
                }}
              />
            </div>
          </Form.Item>

          {/* Auxiliary Options (Remember Me & Forgot Pass) */}
          <div className="flex justify-between items-center text-xs mt-1">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox 
                style={{ color: '#a1a1aa', fontSize: '11px' }}
                className="custom-antd-dark-checkbox"
              >
                Remember me
              </Checkbox>
            </Form.Item>
            <a 
              href="#" 
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
          </div>

          {/* High-Contrast Submission Action button */}
          <Form.Item style={{ marginBottom: 0, marginTop: '8px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              style={{
                backgroundColor: 'white',
                borderColor: 'white',
                color: 'black',
                fontWeight: 650,
                borderRadius: '8px',
                height: '40px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)'
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        {/* Footer info text */}
        <div className="text-[10px] text-center text-zinc-550 mt-1 border-t border-zinc-850 pt-5">
          Don't have an account? <a href="#" className="text-indigo-400 hover:text-indigo-300 font-semibold" onClick={(e) => e.preventDefault()}>Sign up</a>
        </div>

      </div>

    </div>
  );
}
