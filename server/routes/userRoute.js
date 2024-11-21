// import express from 'express';
// import { loginUser,registerUser } from '../controllers/userController.js';
// const userRouter = express.Router();



// userRouter.post("/register",registerUser);
// userRouter.post("/login",loginUser);


// export default userRouter;

import express from 'express';
import { loginUser, registerUser, getUserData } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", getUserData);

export default userRouter;