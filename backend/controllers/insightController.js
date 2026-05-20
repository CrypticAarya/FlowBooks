import Invoice from '../models/Invoice.js';
import Expense from '../models/Expense.js';
import Customer from '../models/Customer.js';

// @desc    Get AI-generated business insights and health score
// @route   GET /api/insights/overview
// @access  Private
export const getInsightsOverview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Parallelize core data fetching for performance
    const [invoices, expenses, customers] = await Promise.all([
      Invoice.find({ user: userId }),
      Expense.find({ user: userId }),
      Customer.find({ user: userId })
    ]);

    let totalRevenue = 0;
    let overdueCount = 0;
    let pendingCount = 0;
    
    invoices.forEach(inv => {
      if (inv.status === 'paid' || inv.status === 'partial') totalRevenue += (inv.paidAmount || 0);
      if (inv.status === 'overdue') overdueCount++;
      if (inv.status === 'pending') pendingCount++;
    });

    let totalExpenses = 0;
    expenses.forEach(exp => { totalExpenses += exp.amount; });

    let netProfit = totalRevenue - totalExpenses;

    // AI Assistant Feed Generation Logic
    const feed = [];
    
    if (overdueCount > 0) {
      feed.push({ type: 'warning', text: `You have ${overdueCount} overdue invoice(s). Follow up immediately to stabilize cash flow.` });
    }
    
    if (pendingCount > 0) {
      feed.push({ type: 'info', text: `There are ${pendingCount} pending invoices awaiting collection.` });
    }

    if (netProfit > 0) {
      feed.push({ type: 'success', text: `Excellent! Your business is operating with a positive net profit of $${netProfit.toLocaleString()}.` });
    } else if (netProfit < 0) {
      feed.push({ type: 'danger', text: `Warning: Your expenses currently exceed your collected revenue by $${Math.abs(netProfit).toLocaleString()}. Review your cost centers.` });
    } else if (totalRevenue === 0 && totalExpenses === 0) {
      feed.push({ type: 'info', text: `Welcome to FlowBooks! Start by logging an invoice or expense to generate insights.` });
    }

    if (customers.length > 0) {
      feed.push({ type: 'info', text: `You are managing ${customers.length} active client profiles. A strong CRM is key to recurring revenue.` });
    }

    // Smart Business Health Score Algorithm (0-100)
    let healthScore = 50; // Base baseline
    
    if (totalRevenue > 0) healthScore += 15;
    if (totalRevenue > 5000) healthScore += 10;
    if (netProfit > 0) healthScore += 15;
    if (overdueCount === 0 && totalRevenue > 0) healthScore += 10;
    if (overdueCount > 0) healthScore -= (overdueCount * 5); // Penalize for overdue
    if (expenses.length > 0 && netProfit > 0) healthScore += 10; // Good margin control

    // Clamp score
    healthScore = Math.max(0, Math.min(100, healthScore));

    res.status(200).json({
      success: true,
      data: {
        healthScore,
        totalRevenue,
        totalExpenses,
        netProfit,
        overdueCount,
        feed
      }
    });
  } catch (error) {
    next(error);
  }
};
