import UserController from "./modules/user/user.controller";
import App from "./app";
import AuthController from "./modules/auth/auth.controller";

const app = new App([new AuthController(), new UserController()]);

app.listen();
