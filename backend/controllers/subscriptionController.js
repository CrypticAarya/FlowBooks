import Subscription from '../models/Subscription.js';
import Invoice from '../models/Invoice.js';
import Customer from '../models/Customer.js';

// Hardcoded SaaS Feature Gates mapping
const PLAN_FEATURES = {
  Free: { invoicesLimit: 5, customersLimit: 3, hasAdvancedAnalytics: false, hasTeamSupport: false },
  Pro: { invoicesLimit: -1, customersLimit: -1, hasAdvancedAnalytics: true, hasTeamSupport: false },
  Business: { invoicesLimit: -1, customersLimit: -1, hasAdvancedAnalytics: true, hasTeamSupport: true }
};

// @desc    Get current subscription details
// @route   GET /api/subscription
// @access  Private
export const getSubscription = async (req, res, next) => {
  try {
    let sub = await Subscription.findOne({ user: req.user.id });
    
    // Auto-onboard to Free plan if none exists
    if (!sub) {
      sub = await Subscription.create({ user: req.user.id });
    }
    res.status(200).json({ success: true, data: sub });
  } catch (error) {
    next(error);
  }
};

// @desc    Upgrade or switch subscription plan
// @route   POST /api/subscription/upgrade
// @access  Private
export const upgradePlan = async (req, res, next) => {
  try {
    const { plan, billingCycle } = req.body;
    
    if (!['Free', 'Pro', 'Business'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }

    let sub = await Subscription.findOne({ user: req.user.id });
    if (!sub) sub = new Subscription({ user: req.user.id });

    sub.plan = plan;
    sub.billingCycle = billingCycle || 'monthly';
    sub.features = PLAN_FEATURES[plan];
    sub.status = 'active';
    sub.paymentStatus = 'paid';
    
    // Extend renewal by 30 days or 365 days
    const days = sub.billingCycle === 'yearly' ? 365 : 30;
    sub.renewalDate = new Date(+new Date() + days * 24 * 60 * 60 * 1000);
    
    await sub.save();
    res.status(200).json({ success: true, data: sub, message: `Successfully upgraded to ${plan}!` });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel current subscription
// @route   POST /api/subscription/cancel
// @access  Private
export const cancelSubscription = async (req, res, next) => {
  try {
    let sub = await Subscription.findOne({ user: req.user.id });
    if (sub) {
      sub.status = 'canceled';
      sub.plan = 'Free';
      sub.features = PLAN_FEATURES['Free'];
      await sub.save();
    }
    res.status(200).json({ success: true, message: 'Subscription canceled. Reverted to Free plan.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get real-time SaaS usage stats
// @route   GET /api/subscription/usage
// @access  Private
export const getUsageStats = async (req, res, next) => {
  try {
    let sub = await Subscription.findOne({ user: req.user.id });
    if (!sub) sub = await Subscription.create({ user: req.user.id });

    const invoicesCount = await Invoice.countDocuments({ user: req.user.id });
    const customersCount = await Customer.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        plan: sub.plan,
        status: sub.status,
        invoices: { used: invoicesCount, limit: sub.features.invoicesLimit },
        customers: { used: customersCount, limit: sub.features.customersLimit },
        features: sub.features
      }
    });
  } catch (error) {
    next(error);
  }
};
