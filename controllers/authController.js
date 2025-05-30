const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Technician = require('../models/Technician');

const sendVerificationTech = require('../utility/sendVerificationEmailTech');

const sendVerificationEmail = require('../utility/sendVerificationEmail');
const sendResetPasswordEmail = require('../utility/sendResetPasswordEmail')
const AccessSetting = require('../models/AccessSettings');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.registerTechnician = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await Technician.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newTech = new Technician({ email, passwordHash });
    await newTech.save();
    const verificationToken = jwt.sign({ id: newTech._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log(verificationToken);
    await sendVerificationEmail(newTech.email, verificationToken);
    res.status(201).json({ msg: 'Technician registered successfully! Verify you Email to login' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.loginTechnician = async (req, res) => {
  const { email, password } = req.body;
  try {
    const tech = await Technician.findOne({ email });
    if (!tech) return res.status(400).json({ msg: 'Invalid credentials' });

    if (!tech.isVerified) return res.status(400).json({ msg: 'Email not verified' });

    const isMatch = await bcrypt.compare(password, tech.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: tech._id }, process.env.JWT_SECRET, { expiresIn: '2d' });
    res.json({ token, technician: { id: tech._id, name: tech.name, email: tech.email , role:tech.role} });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// shop owner will add tech manually and email will be sent to tech you are added by shop owner
exports.createTech = async (req, res) => {

  console.log("hereeeeeeeeeeeeee");

  const { email, password } = req.body;
  try {
    const existing = await Technician.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    console.log(req.user, "req user hereeeeeeeeeeeee");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt,);
    let role = "tech";
    let isVerified = true;
    let creatorId = req.user.id;


    const newTech = new Technician({ email, passwordHash, role, isVerified, creatorId });
    await newTech.save();

    await sendVerificationTech(newTech.email, req.user.email, password);
    res.status(201).json({ msg: 'Technician registered successfully! Verify you Email to login' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }

}

exports.getTech = async (req, res) => {
  try {
    const techs = await Technician.find({ creatorId: req.user.id });

    // Get access setting for each tech
    const enrichedTechs = await Promise.all(
      techs.map(async (tech) => {
        const setting = await AccessSetting.findOne({ technicianId: tech._id });
        return {
          id: tech._id,
          name: tech.name,
          email: tech.email,
          isVerified: tech.isVerified,
          accessSetting: setting || { reports: false },
        };
      })
    );

    res.status(200).json(enrichedTechs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.deleteTech = async (req, res) => {
  const techId = req.params.id;

  try {
    // Delete technician
    const deletedTech = await Technician.findOneAndDelete({ _id: techId, creatorId: req.user.id });
    if (!deletedTech) {
      return res.status(404).json({ msg: 'Technician not found or not authorized' });
    }

    // Optionally delete associated access setting
    await AccessSetting.findOneAndDelete({ technicianId: techId });

    res.status(200).json({ msg: 'Technician and associated settings deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    let payload;

    if (token === 'testing') {
      //  Testing Mode: Fake payload
      payload = {
        name: 'Test Technician',
        email: 'testtechnician@example.com',
      };
    } else {
      if (!token) return res.status(400).json({ msg: 'No token provided' });

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      payload = ticket.getPayload();
    }

    let tech = await Technician.findOne({ email: payload.email });

    if (!tech) {
      tech = new Technician({
        name: payload.name,
        email: payload.email,
        passwordHash: '',
        isVerified:true
      });
      await tech.save();
    }

    const jwtToken = jwt.sign({ id: tech._id }, process.env.JWT_SECRET, { expiresIn: '2d' });

    res.json({
      token: jwtToken,
      technician: {
        id: tech._id,
        name: tech.name,
        email: tech.email,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).json({ msg: 'Missing verification token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tech = await Technician.findById(decoded.id);
    if (!tech) return res.status(404).json({ msg: 'Technician not found' });

    if (tech.isVerified) return res.status(400).json({ msg: 'Email already verified' });

    tech.isVerified = true;
    await tech.save();

    res.status(200).json({ msg: 'Email verified successfully!' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
};
exports.resetPasswordRequest = async (req, res) => {
  const { email } = req.body;
  try {
    const tech = await Technician.findOne({ email });
    if (!tech) return res.status(404).json({ msg: 'Technician not found' });

    // Create reset password token
    const resetToken = jwt.sign({ id: tech._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Store the token and expiry in the technician document
    tech.resetPasswordToken = resetToken;
    tech.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await tech.save();

    // Send reset password email
    await sendResetPasswordEmail(tech.email, resetToken);

    res.status(200).json({ msg: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tech = await Technician.findById(decoded.id);
    if (!tech) return res.status(404).json({ msg: 'Technician not found' });

    // Check if token has expired
    if (Date.now() > tech.resetPasswordExpires) {
      return res.status(400).json({ msg: 'Reset token has expired' });
    }

    // Hash the new password and update it
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    tech.passwordHash = passwordHash;

    // Clear reset token and expiry
    tech.resetPasswordToken = undefined;
    tech.resetPasswordExpires = undefined;

    await tech.save();

    res.status(200).json({ msg: 'Password successfully reset' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
};



const getUserFromToken = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Technician.findById(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

exports.getCurrentTechnician = async (req, res) => {
  try {
    const tech = await getUserFromToken(req);
    res.json({
      id: tech._id,
      name: tech.name,
      email: tech.email,
      isVerified: tech.isVerified,
      role: tech.role
    });
  } catch (err) {
    res.status(401).json({ msg: err.message });
  }
};

