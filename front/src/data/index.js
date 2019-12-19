import AuthService from './auth.service';
import UserService from './user.service';

export default {
  auth: new AuthService(),
  user: new UserService(),
};
