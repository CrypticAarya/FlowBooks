import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function Register() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      return message.error('Passwords do not match!');
    }

    try {
      setLoading(true);
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      const response = await axios.post('http://localhost:5001/api/auth/register', payload);

      if (response.data && response.data.success) {
        // Store JWT token securely in localStorage
        localStorage.setItem('flowbooks_token', response.data.data.token);
        
        message.success('Registration successful! Redirecting to dashboard...');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (err) {
      console.error('Registration Error:', err);
      message.error(err.response?.data?.message || 'Failed to register account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4 font-sans antialiased animate-fade-in py-12">
      
      {/* Centered Registration Card */}
      <div className="w-full max-w-[420px] bg-[#121214] border border-zinc-850 rounded-2xl p-8 md:p-10 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2.5">
          <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-black font-extrabold text-xl shadow-lg shadow-white/5">
            F
          </div>
          <h1 className="font-display font-bold text-lg tracking-tight text-white mt-1">
            Create an Account
          </h1>
          <p className="text-xs text-zinc-450 leading-relaxed max-w-[280px]">
            Sign up for FlowBooks to start managing your billing and financial operations.
          </p>
        </div>

        {/* Ant Design Form Wrapper */}
        <Form
          name="flowbooks_register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          className="flex flex-col gap-4 mt-2"
        >
          {/* Name Form Input */}
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
            style={{ marginBottom: '4px' }}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Full Name</label>
              <Input 
                prefix={<UserOutlined className="text-zinc-550 mr-1.5" />} 
                placeholder="Jane Doe" 
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

          {/* Email Form Input */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
            style={{ marginBottom: '4px' }}
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
            style={{ marginBottom: '4px' }}
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

          {/* Confirm Password Form Input */}
          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: 'Please confirm your password' }]}
            style={{ marginBottom: '12px' }}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Confirm Password</label>
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

          {/* High-Contrast Submission Action button */}
          <Form.Item style={{ marginBottom: 0, marginTop: '8px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
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
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        {/* Footer info text */}
        <div className="text-[10px] text-center text-zinc-550 mt-1 border-t border-zinc-850 pt-5">
          Already have an account? <a href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">Sign in</a>
        </div>

      </div>

    </div>
  );
}
