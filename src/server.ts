import UploadController from './modules/upload/upload.controller'
import App from './app'
import AuthController from './modules/auth/auth.controller'
import CategoryController from './modules/category/category.controller'
import ProductController from './modules/product/product.controller'
import UserController from './modules/user/user.controller'

const app = new App([
  new AuthController(),
  new UserController(),
  new ProductController(),
  new CategoryController(),
  new UploadController()
])

app.listen()
