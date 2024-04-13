const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
require("colors");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { engine } = require('express-handlebars'); 

const connectDB = require("../config/db");

const configPath = path.join(__dirname, "..", "config", ".env");
const auth = require("./middlewares/auth");

const app = express();


// set template engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'backend/views');


dotenv.config({ path: configPath });

// const { PORT } = process.env
// console.log("PORT", process.env.PORT)

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// set Routes

app.use("/api/v1", require("./routes/moviesRoutes"));
app.use(express.static("public"))

const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

// Reristration - create new user at BD

// Authenticate - check datas, which user gives us, whith datas which we have

// Authorization - user can action something, or visited any links

// Logout - exit from the system

const userModel = require("./models/usersModel");
const RoleModel = require("./models/rolesModel");
const { privateDecrypt } = require("crypto");
const sendEmail = require('./services/sendEmail');

app.post(
  "/api/v1/register",
  asyncHandler(async (request, response) => {
    // отримуємо дані від користувача
    // робимо валідацію даних,  якщо даних нема викидаємо помилку
    // якщо прийшли і валідні, шукаємо та перевіряємо чи є такий у БД
    // якщо користувач є, повідомляємо шо він є і рекомендуємо залогінитися
    // якщо користувача нема, хешуємо пароль
    // реєстуємо користувача у БД - реєстрація успішна!

    const { email, password } = request.body;

    if (!email || !password) {
      response.status(400);
      throw new Error("Provide all required fields");
    }

    // const candidate = await userModel.findOne({ email });

    //! якшо у модель не пишемо унікальні поля
    // if (candidate) {
    //   response.status(400);
    //   throw new Error("User already exists");
    // }

    const hashPassword = bcrypt.hashSync(password, 10);

    if (!hashPassword) {
      response.status(400);
      throw new Error("Service is out of order, try later");
    }

    const userRole = await RoleModel.findOne({ value: "ADMIN" })

    const user = await userModel.create({
      ...request.body,
      password: hashPassword,
      roles: [userRole.value]
    });

    if (!user) {
      response.status(400);
      throw new Error("Can't save user in BD");
    }

    response.status(201).json({
      code: 201,
      message: "Registration succesfully",
    });
  })
);

app.post(
  "/api/v1/login",
  asyncHandler(async (request, response) => {
    // отримуємо дані від користувача
    // робимо контролерну валідацію цих полів від користувача, якщо дані не валідні то викидаємо помилку
    // якщо дані прийшли: 1) шукаємо користувача по email, 2) розшифровуємо пароль;
    // якщо користувача не знаходимо у БД, або не розшифровуємо пароль, кидаємо помилку невірний логін чи пароль
    // якщо знайшли користувача і розшифрували пароль - генеруємо токен;
    // записуємо токен у БД;

    const { email, password } = request.body;

    if (!email || !password) {
      response.status(400);
      throw new Error("Provide all required fields");
    }

    const user = await userModel.findOne({ email });

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!user || !validPassword) {
      response.status(400);
      throw new Error("Wrong login or password");
    }

    const token = generateToken({ id: user._id, email: user.email });

    user.token = token;

    const userWithToken = await user.save();

    if (!userWithToken) {
      response.status(400);
      throw new Error("Unable to save token");
    }

    response.status(200).json({
      data: {
        token,
        email,
      },
      code: 200,
      message: "Login success",
    });
  })
);

app.get(
  "/api/v1/logout",
  auth,
  asyncHandler(async (request, response) => {
    console.log(request.user);

    await userModel.findByIdAndUpdate(request.user.id, { token: null });
    response.status(200).json({
      code: 200,
      message: "Logout success",
    });
  })
);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    // res.render('contact', {message: "Contact send success", user: "Vito"});
    res.render('contact');
});

app.post('/send', async (req, res) => {
  try {
      // res.send(req.body);
      res.render("send", { message: "Contact send success", user: req.body.userName, email: req.body.userEmail })
  await sendEmail(req.body)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }


});

app.use("*", notFound);
app.use(errorHandler);

const generateToken = (data) => {
  const token = jwt.sign(data, "pretty_boy", {
    expiresIn: "8h",
  });

  return token;
};

connectDB();

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running successfully on port - ${process.env.PORT}, mode: ${process.env.NODE_ENV} `
      .green.italic.bold
  );
});
