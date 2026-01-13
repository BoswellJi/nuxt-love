import User from '../../models/User';

export default defineEventHandler(async (e) => {
  try {
    const body = await readBody(e);
    const users = await User.create({
      name: body.name,
    });
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
