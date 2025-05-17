const AccessSetting = require('../models/AccessSettings');


exports.setAccessSetting = async (req, res) => {
    try {
      const { technicianId, ...fieldsToUpdate } = req.body;
  
      if (!technicianId) {
        return res.status(400).json({ msg: 'Technician ID is required' });
      }
  
      let setting = await AccessSetting.findOne({ technicianId });
  
      if (setting) {
        // Only update provided fields
        Object.keys(fieldsToUpdate).forEach((key) => {
          setting[key] = fieldsToUpdate[key];
        });
        await setting.save();
      } else {
        // Create new setting with only the provided fields
        setting = new AccessSetting({
          technicianId,
          ...fieldsToUpdate,
        });
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
    const  technicianId  = req.user;

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
    const  technicianId  = req.user;

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
