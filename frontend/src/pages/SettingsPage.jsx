import React from 'react';
import { Button, Input, Select, Switch } from 'antd';
import { 
  SaveOutlined, 
  SafetyCertificateOutlined, 
  GlobalOutlined,
  ApiOutlined 
} from '@ant-design/icons';

const { Option } = Select;

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-fade-in">
      
      {/* Title Header Bar */}
      <div>
        <h1 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight">
          System Settings
        </h1>
        <p className="text-xs text-zinc-450 mt-1">
          Coordinate Stripe integrations, brand credentials, invoice layouts, and webhooks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: General Profile & Brand settings */}
        <div className="lg:col-span-2 bg-[#121214] border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col gap-5">
          <h2 className="font-display text-sm font-bold text-white pb-3 border-b border-zinc-850 flex items-center gap-2">
            <GlobalOutlined className="text-zinc-550" />
            General Branding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Brand / Platform Name</label>
              <Input 
                value="FlowBooks" 
                style={{ 
                  backgroundColor: '#18181b', 
                  borderColor: '#27272a',
                  color: 'white',
                  borderRadius: '6px',
                  height: '38px',
                  fontSize: '12px'
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Support/Billing Email</label>
              <Input 
                value="billing@flowbooks.io" 
                style={{ 
                  backgroundColor: '#18181b', 
                  borderColor: '#27272a',
                  color: 'white',
                  borderRadius: '6px',
                  height: '38px',
                  fontSize: '12px'
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Default Currency</label>
              <Select 
                defaultValue="USD" 
                style={{ width: '100%' }}
                className="custom-antd-dark-select"
                dropdownStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
              >
                <Option value="USD">USD ($) United States Dollar</Option>
                <Option value="EUR">EUR (€) Euro</Option>
                <Option value="GBP">GBP (£) British Pound</Option>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Invoice Net Terms</label>
              <Select 
                defaultValue="30" 
                style={{ width: '100%' }}
                className="custom-antd-dark-select"
              >
                <Option value="15">NET 15 Days</Option>
                <Option value="30">NET 30 Days</Option>
                <Option value="60">NET 60 Days</Option>
              </Select>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              style={{
                backgroundColor: 'white',
                borderColor: 'white',
                color: 'black',
                fontWeight: 600,
                borderRadius: '8px',
                fontSize: '12px',
                height: '36px'
              }}
            >
              Save Brand Changes
            </Button>
          </div>
        </div>

        {/* Right Side: Integrations Toggles & Security options */}
        <div className="flex flex-col gap-6">
          
          {/* Card: Sync Services */}
          <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-display text-sm font-bold text-white pb-3 border-b border-zinc-850 flex items-center gap-2">
              <ApiOutlined className="text-zinc-550" />
              Integrations Sync
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <strong className="block text-xs font-semibold text-zinc-300">Stripe Live Gateway</strong>
                <span className="text-[10px] text-zinc-550">Pull real transactions from stripe-inflows</span>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <strong className="block text-xs font-semibold text-zinc-300">Automated Accounting</strong>
                <span className="text-[10px] text-zinc-550">Auto-post invoices directly on payment settling</span>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <strong className="block text-xs font-semibold text-zinc-300">Slack Webhook alerts</strong>
                <span className="text-[10px] text-zinc-550">Ping internal channels for pending milestones</span>
              </div>
              <Switch />
            </div>
          </div>

          {/* Card: Credentials */}
          <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col gap-3">
            <h3 className="font-display text-xs font-bold text-white flex items-center gap-1.5">
              <SafetyCertificateOutlined className="text-zinc-500" />
              Developer API Keys
            </h3>
            <p className="text-[10px] text-zinc-550 leading-relaxed">
              Use visual developer credential keys to integrate FlowBooks data pipes with custom reporting tools.
            </p>
            <Button 
              block 
              style={{
                backgroundColor: 'transparent',
                borderColor: '#27272a',
                color: '#d4d4d8',
                fontSize: '11px',
                fontWeight: 500,
                borderRadius: '6px'
              }}
            >
              Reveal API Secret Key
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
}
