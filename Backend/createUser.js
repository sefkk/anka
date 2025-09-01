require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const user = new User({
      name: 'John',
      surname: 'Doe',
      username: 'johndoe',
      password: 'mypassword'
    });

    await user.save();
    console.log('User created successfully!');
    process.exit();
  })
  .catch(err => {
    console.error('Error creating user:', err);
    process.exit(1);
  });
