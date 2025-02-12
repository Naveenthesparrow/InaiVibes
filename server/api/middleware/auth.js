const expiryDate = new Date(Date.now() + 3600000); // 1 hour expiry

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Use HTTPS in production
  sameSite: "strict", // Helps prevent CSRF attacks
  expires: expiryDate,
};

// Signin
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(403, "Wrong credentials!"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: hashedPassword, ...rest } = validUser._doc;

    res.cookie("accessToken", token, cookieOptions).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Google Login
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;

      res.cookie("access_token", token, cookieOptions).status(200).json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: req.body.name.replace(/\s/g, "").toLowerCase() + Math.floor(Math.random() * 10000),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;

      res.cookie("access_token", token, cookieOptions).status(200).json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// Signout
export const signout = (req, res) => {
  res.clearCookie("access_token", cookieOptions).status(200).json("Signout success!");
};
