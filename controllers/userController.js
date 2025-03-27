const { User } = require('../models');
const { userUpdateSchema } = require('../validations/userValidation');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'bio', 'website']
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { error, value } = userUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    await User.update(value, { where: { id: req.user.id } });
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'bio', 'website']
    });
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
