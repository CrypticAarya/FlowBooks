import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const INCOME_COLOR = '#22C55E'
const EXPENSE_COLOR = '#EF4444'
const PIE_COLORS = ['#22C55E', '#16A34A', '#15803D', '#4ADE80', '#86EFAC']

export default function DashboardCharts({ transactions }) {
  let income = 0
  let expense = 0
  const expenseMap = {}

  transactions.forEach((tx) => {
    if (tx.type === 'Income') income += tx.amount
    if (tx.type === 'Expense') {
      expense += tx.amount
      expenseMap[tx.description] = (expenseMap[tx.description] || 0) + tx.amount
    }
  })

  const barData = [
    { name: 'Income', amount: income },
    { name: 'Expense', amount: expense },
  ]

  const pieData = Object.entries(expenseMap).map(([name, value]) => ({
    name,
    value,
  }))

  const tooltipStyle = {
    backgroundColor: '#0F172A',
    border: '1px solid #1E293B',
    borderRadius: '8px',
    color: '#fff',
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-card border border-border rounded-xl p-6 shadow-glow">
        <h3 className="text-sm font-medium text-white mb-4">Income vs Expense</h3>
        {transactions.length === 0 ? (
          <p className="text-muted text-sm h-48 flex items-center justify-center">
            Add transactions to see chart
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                <Cell fill={INCOME_COLOR} />
                <Cell fill={EXPENSE_COLOR} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-glow">
        <h3 className="text-sm font-medium text-white mb-4">Expense Breakdown</h3>
        {pieData.length === 0 ? (
          <p className="text-muted text-sm h-48 flex items-center justify-center">
            No expenses to display
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name }) => name}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${Number(value).toLocaleString()}`}
                contentStyle={tooltipStyle}
              />
              <Legend wrapperStyle={{ color: '#94A3B8', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
