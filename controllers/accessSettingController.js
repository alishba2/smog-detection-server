const AccessSetting = require('../models/AccessSettings');

// Create or update access setting
exports.setAccessSetting = async (req, res) => {
  try {
    const { technicianId, reports } = req.body;

    let setting = await AccessSetting.findOne({ technicianId });

    if (setting) {
      setting.reports = reports;
      await setting.save();
    } else {
      setting = new AccessSetting({ technicianId, reports });
      await setting.save();
    }

    res.status(200).json({ msg: 'Access setting saved successfully', setting });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get access setting by technician ID
exports.getAccessSetting = async (req, res) => {
  try {
    const { technicianId } = req.params;

    const setting = await AccessSetting.findOne({ technicianId });

    if (!setting) {
      return res.status(404).json({ msg: 'Access setting not found' });
    }

    res.status(200).json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete access setting
exports.deleteAccessSetting = async (req, res) => {
  try {
    const { technicianId } = req.params;

    const setting = await AccessSetting.findOneAndDelete({ technicianId });

    if (!setting) {
      return res.status(404).json({ msg: 'Access setting not found' });
    }

    res.status(200).json({ msg: 'Access setting deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
