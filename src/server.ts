import UserController from "./controllers/user.controller";
import App from "./app";
import AuthController from "./controllers/auth.controller";

const app = new App([new AuthController(), new UserController()]);

app.listen();
