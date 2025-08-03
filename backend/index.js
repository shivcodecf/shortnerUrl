// import express from 'express';
// import dotenv from 'dotenv';
// import userRoute from './routes/user.route.js';
// import connectDB from './config/db.js';
// import urlRoute from './routes/url.route.js';
// import cors from 'cors';
// import Url from './models/url.model.js';

// dotenv.config();

// const app = express();

// app.use(cors({
//   origin: 'http://localhost:5173', 
//   credentials: true,
// }));

// app.use(express.json());


// app.use('/api/user', userRoute);

// app.use('', urlRoute);



// const PORT = process.env.PORT || 8000;

// connectDB()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`🚀 Server started on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ Failed to connect to MongoDB:', err);
//     process.exit(1);
//   });


// index.js
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });
