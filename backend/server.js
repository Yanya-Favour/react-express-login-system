const path = require('path');
const dotenv = require('dotenv');

const result = dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sanitizeHtml = require('sanitize-html');

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI must be set in the backend environment.');
}

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

const client = new MongoClient(uri);
const clientPromise = client.connect();
const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET;

if (isProduction && !sessionSecret) {
  throw new Error('SESSION_SECRET must be set in the backend environment.');
}

app.set('trust proxy', 1);
app.use(session({
  secret: sessionSecret || 'development-only-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    clientPromise,
    collectionName: 'sessions',
  }),
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  },
}));

app.use(express.static(path.join(__dirname, '/dist')));

app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/profile', (req, res) => {
  if (!req.session.email) {
    return res.status(200).send({ message: 'Not logged in' });
  } else {
    return res.send({ email: req.session.email, name: req.session.name });
  }
});

function sanitizeInput(input) {
  return sanitizeHtml(input, {
    allowedTags: [],  
    allowedAttributes: {},  
  });
}

app.post('/login', async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  email = sanitizeInput(email);
  password = sanitizeInput(password);

  try {
    const database = client.db('login-system');
    const usersCollection = database.collection('users');

    const user = await usersCollection.findOne({ email: email });

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        req.session.name = user.name;
        req.session.email = email; 
        res.send({ success: true, user }); 
      } else {
        res.status(400).send({ success: false, message: 'Incorrect email and password' }); 
      }
    } else {
      res.status(400).send({ success: false, message: 'User not found' }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Error during the login process' });
  }
});

app.post('/register', async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;

  name = sanitizeInput(name);
  email = sanitizeInput(email);
  password = sanitizeInput(password);
  confirmPassword = sanitizeInput(confirmPassword);

  if (password !== confirmPassword) {
    return res.status(400).send({ success: false, message: 'Passwords do not match.' }); 
  } 
    const database = client.db('login-system');
    const usersCollection = database.collection('users');
    const userExists = await usersCollection.findOne({ email: email });

      if (userExists) {
        return res.status(400).send({ success: false, message: 'Email already exists.'});
      }

      try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
          name: name, 
          email: email,
          password: hashedPassword
        };

        const result = await usersCollection.insertOne(newUser);

        console.log("User added!");

        req.session.name = name;
        req.session.email = email;

       return  res.status(201).send({ success: true, message: 'Registration successful!', user: newUser});

      } catch (error) { 
        console.error(error);
       return  res.status(500).send({ success: false, message: 'Error during the registration.'});
      }
      
});

app.post('/logout', (req, res) => {
  if (!req.session.email) {
    res.send('Already logged out');
  }
  req.session.destroy(function () {
    res.send('Logged out!');
    console.log('User logged out');
  });
});

clientPromise
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB Atlas', error);
    process.exit(1);
  });