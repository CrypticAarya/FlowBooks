import BusinessProfile from '../models/BusinessProfile.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get seller business profile
// @route   GET /api/settings/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    let profile = await BusinessProfile.findOne({ user: req.user.id });
    
    // Auto-create a default profile if one does not exist for the new user yet
    if (!profile) {
      profile = await BusinessProfile.create({
        user: req.user.id,
        ownerName: req.user.name || '',
        email: req.user.email || ''
      });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update seller business profile and preferences
// @route   PUT /api/settings/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    let profile = await BusinessProfile.findOne({ user: req.user.id });

    if (!profile) {
      profile = await BusinessProfile.create({ user: req.user.id, ...req.body });
    } else {
      profile = await BusinessProfile.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update seller account password
// @route   PUT /api/settings/password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    // Fetch user securely to compare passwords
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid current password' });
    }

    // Encrypt and save the newly requested password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
