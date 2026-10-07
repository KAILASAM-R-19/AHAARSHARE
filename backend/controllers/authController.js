const User = require('../models/User');

function register(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  const organizationName = req.body.organizationName;
  const location = req.body.location;
  const phoneNumber = req.body.phoneNumber;

  const user = new User({
    email: email,
    password: password,
    role: role,
    organizationName: organizationName,
    location: location,
    phoneNumber: phoneNumber
  });

  user.save()
    .then(function(savedUser) {
      res.status(201).json({ message: 'User created successfully', userId: savedUser._id });
    })
    .catch(function(error) {
      res.status(500).json({ error: 'Registration failed' });
    });
}

function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email, password: password })
    .then(function(user) {
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.json({ userId: user._id, role: user.role });
    })
    .catch(function(error) {
      res.status(500).json({ error: 'Login failed' });
    });
}

module.exports = {
  register: register,
  login: login
};
