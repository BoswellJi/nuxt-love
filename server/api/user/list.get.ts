import { UserService } from '../../services/UserService';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const service = new UserService();
    const users = await service.getUsers(page, limit);

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
});
