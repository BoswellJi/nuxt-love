import User from '../models/User';

export class UserRepository {
  async findAll(options = {}) {
    return User.findAll({
      where: { deleted_at: null },
      ...options,
    });
  }

  async findById(id: number) {
    return User.findByPk(id);
  }

  async create(data: { name: string }) {
    return User.create(data);
  }

  async update(id: number, data: Partial<{ name: string }>) {
    const user = await this.findById(id);
    if (!user) throw new Error('用户不存在');
    return user.update(data);
  }

  async softDelete(id: number) {
    const user = await this.findById(id);
    if (!user) throw new Error('用户不存在');
    return user.destroy();
  }
}
