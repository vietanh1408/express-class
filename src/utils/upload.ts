import { environments } from './../constants/environments'
import * as cloud from 'cloudinary'

cloud.v2.config({
  cloud_name: environments.CLOUD_NAME,
  api_key: environments.CLOUD_API_KEY,
  api_secret: environments.CLOUD_API_SECRET,
  secure: true
})
