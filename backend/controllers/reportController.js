import Invoice from '../models/Invoice.js';
import Expense from '../models/Expense.js';
import Customer from '../models/Customer.js';

// ─── Helper: month label from index ───────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// @desc    Full business summary report
// @route   GET /api/reports/business-summary
// @access  Private
export const getBusinessSummary = async (req, res, next) => {
  try {
    const uid = req.user.id;
    const [invoices, expenses, customers] = await Promise.all([
      Invoice.find({ user: uid }),
      Expense.find({ user: uid }),
      Customer.find({ user: uid })
    ]);

    let totalRevenue = 0, totalPending = 0, totalOverdue = 0;
    invoices.forEach(inv => {
      if (inv.status === 'paid' || inv.status === 'partial') totalRevenue += (inv.paidAmount || 0);
      if (inv.status === 'pending') totalPending += inv.amount;
      if (inv.status === 'overdue') totalOverdue += inv.amount;
    });

    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    // Monthly revenue breakdown
    const monthlyMap = {};
    invoices.forEach(inv => {
      if (inv.status === 'paid' || inv.status === 'partial') {
        const m = new Date(inv.createdAt).getMonth();
        monthlyMap[m] = (monthlyMap[m] || 0) + (inv.paidAmount || 0);
      }
    });
    const monthlyRevenue = MONTHS.map((name, i) => ({ name, revenue: monthlyMap[i] || 0 }));

    // Monthly expense breakdown
    const expMonthlyMap = {};
    expenses.forEach(exp => {
      const m = new Date(exp.createdAt || exp.expenseDate).getMonth();
      expMonthlyMap[m] = (expMonthlyMap[m] || 0) + exp.amount;
    });
    const monthlyExpenses = MONTHS.map((name, i) => ({ name, expenses: expMonthlyMap[i] || 0 }));

    // Category totals
    const categoryMap = {};
    expenses.forEach(exp => {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    });
    const expenseByCategory = Object.entries(categoryMap).map(([category, amount]) => ({ category, amount }));

    // Top customers by spend
    const topCustomers = [...customers]
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, 5)
      .map(c => ({ name: c.name, email: c.email, totalSpent: c.totalSpent || 0, totalInvoices: c.totalInvoices || 0 }));

    res.status(200).json({
      success: true,
      data: {
        summary: { totalRevenue, totalExpenses, netProfit, totalPending, totalOverdue, totalInvoices: invoices.length, totalCustomers: customers.length },
        monthlyRevenue,
        monthlyExpenses,
        expenseByCategory,
        topCustomers,
        invoiceStatusBreakdown: {
          paid: invoices.filter(i => i.status === 'paid').length,
          pending: invoices.filter(i => i.status === 'pending').length,
          overdue: invoices.filter(i => i.status === 'overdue').length,
          partial: invoices.filter(i => i.status === 'partial').length,
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export all data as CSV
// @route   GET /api/reports/export/csv
// @access  Private
export const exportCSV = async (req, res, next) => {
  try {
    const uid = req.user.id;
    const { type = 'invoices' } = req.query;

    let csvContent = '';

    if (type === 'invoices') {
      const invoices = await Invoice.find({ user: uid });
      csvContent = 'Invoice Number,Client,Project,Amount,Paid Amount,Status,Due Date\n';
      invoices.forEach(inv => {
        csvContent += `${inv.invoiceNumber},"${inv.clientName}","${inv.project || ''}",${inv.amount},${inv.paidAmount || 0},${inv.status},${inv.dueDate}\n`;
      });
    } else if (type === 'expenses') {
      const expenses = await Expense.find({ user: uid });
      csvContent = 'Title,Amount,Category,Payment Method,Date\n';
      expenses.forEach(exp => {
        csvContent += `"${exp.title}",${exp.amount},"${exp.category}","${exp.paymentMethod}","${exp.expenseDate || exp.createdAt}"\n`;
      });
    } else if (type === 'customers') {
      const customers = await Customer.find({ user: uid });
      csvContent = 'Name,Email,Phone,Company,Total Spent,Total Invoices\n';
      customers.forEach(c => {
        csvContent += `"${c.name}","${c.email}","${c.phone || ''}","${c.company || ''}",${c.totalSpent || 0},${c.totalInvoices || 0}\n`;
      });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=flowbooks_${type}_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
