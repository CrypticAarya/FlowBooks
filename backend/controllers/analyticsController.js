import Invoice from '../models/Invoice.js';
import Expense from '../models/Expense.js';
import BusinessProfile from '../models/BusinessProfile.js';

// @desc    Get dashboard overview metrics and analytics
// @route   GET /api/analytics/overview
// @access  Private (Seller only)
export const getAnalyticsOverview = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Basic Metrics & Status Distribution
    // Fetch all invoices for the authenticated user to compute basic metrics
    const invoices = await Invoice.find({ user: userId });
    
    let totalRevenue = 0;
    let pendingRevenue = 0;
    let overdueRevenue = 0;
    let paidInvoicesCount = 0;

    const statusDistribution = {
      paid: 0,
      pending: 0,
      overdue: 0
    };

    invoices.forEach(inv => {
      statusDistribution[inv.status] += 1;
      
      if (inv.status === 'paid') {
        totalRevenue += inv.amount;
        paidInvoicesCount += 1;
      } else if (inv.status === 'pending') {
        pendingRevenue += inv.amount;
      } else if (inv.status === 'overdue') {
        overdueRevenue += inv.amount;
      }
    });

    const averageInvoiceValue = invoices.length > 0 
      ? (invoices.reduce((acc, curr) => acc + curr.amount, 0) / invoices.length).toFixed(2)
      : 0;

    // 2. Expenses & Profit Margins
    const expenses = await Expense.find({ user: userId });
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    // Expense Category Breakdown via Aggregation
    const expenseCategories = await Expense.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 4 } // Top 4 biggest expense categories
    ]);

    // 3. Monthly Revenue Aggregation (MongoDB Aggregation Pipeline)
    // Aggregation is powerful here: it groups paid invoices by the month they were created
    const monthlyRevenue = await Invoice.aggregate([
      { $match: { user: req.user._id, status: 'paid' } },
      { 
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Map month numbers to short names for frontend charting
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
      name: monthNames[item._id - 1],
      total: item.total
    }));

    // Fill in missing months so the chart always looks continuous
    const finalMonthlyRevenue = monthNames.map((name, index) => {
      const found = formattedMonthlyRevenue.find(m => m.name === name);
      return found ? found : { name, total: 0 };
    });

    // 3. Top Customers (MongoDB Aggregation Pipeline)
    // Groups paid invoices by clientName to find the most valuable clients
    const topCustomers = await Invoice.aggregate([
      { $match: { user: req.user._id, status: 'paid' } },
      {
        $group: {
          _id: "$clientName",
          totalSpent: { $sum: "$amount" },
          invoiceCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 3 }
    ]);

    // 4. Recent Invoices
    // Fetches the 4 most recently created invoices for the dashboard feed
    const recentInvoices = await Invoice.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(4);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalRevenue,
          totalExpenses,
          netProfit,
          pendingRevenue,
          overdueRevenue,
          totalInvoices: invoices.length,
          paidInvoicesCount,
          averageInvoiceValue
        },
        expenseCategories,
        statusDistribution: [
          { name: 'Paid', value: statusDistribution.paid, fill: '#10b981' },
          { name: 'Pending', value: statusDistribution.pending, fill: '#f59e0b' },
          { name: 'Overdue', value: statusDistribution.overdue, fill: '#ef4444' }
        ],
        monthlyRevenue: finalMonthlyRevenue,
        topCustomers,
        recentInvoices,
        businessProfile: await BusinessProfile.findOne({ user: req.user._id })
      }
    });
  } catch (error) {
    next(error);
  }
};
