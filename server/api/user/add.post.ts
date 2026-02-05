import { UserService } from '../../services/UserService';
import { CreateUserSchema } from '../../schemas/user.schema';

export default defineEventHandler(async (e) => {
  try {
    const service = new UserService();
    const body = await readBody(e);
    const validated = CreateUserSchema.parse(body);
    const users = await service.createUser(body.name);
    return {
      success: true,
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      message: '创建用户失败',
      error: (error as Error).message,
    };
  }
});
