// server/services/UserService.ts
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
  private repository = new UserRepository();

  async getUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const users = await this.repository.findAll({
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });
    return users;
  }

  async createUser(name: string) {
    // 业务逻辑：验证、规范化
    if (!name || name.length < 2) {
      throw new Error('用户名至少2个字符');
    }
    return this.repository.create({ name: name.trim() });
  }
}
