export const validators = {
  isPhone: (phone: string) => /^1[3-9]\d{9}$/.test(phone),
  isEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isIdCard: (id: string) => /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id),
};
