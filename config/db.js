const mongoose = require ("mongoose");

mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb+srv://'+process.env.DB_USER_PASS+'@cluster0.rgz6a.mongodb.net/miyoo', { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
 })
.then( ()=> console.log('Connected to mongoDb - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'))
.catch( (err) => console.log('Failed to connect MongoDb : ', err))

