const { v4: uuidv4 } = require('uuid');
const userRepository = require('../repositories/user.repository');

class UserService {
  async registerUser(data) {
    // check if mobile or email already exists
    const existingMobile = await userRepository.findByMobile(data.mobile);
    if (existingMobile) {
      // need 400 error for this
      const error = new Error('Mobile number already exists');
      error.status = 400;
      throw error;
    }
    const existingEmail = await userRepository.findByEmail(data.email);
    if (existingEmail) {
      const error = new Error('Email already exists');
      error.status = 400;
      throw error;
    }
      // generate unique mnemonic_id
    const mnemonic_id = `USR${uuidv4()}`;
    const role = 'USER'; // default role for registered users
    const is_active = false; // new users are inactive by default, can be activated after verification
    return userRepository.create({ ...data, mnemonic_id, role, is_active });
  }
  async createUser(data) { return userRepository.create(data); }
  async getUserById(id) { return userRepository.findById(id); }
  async getAllUsers(query) { return userRepository.findAll(query); }
  async updateUser(id, data) { return userRepository.update(id, data); }
  async deleteUser(id) { return userRepository.delete(id); }
  async getUserByMobile(mobile) { return userRepository.findByMobile(mobile); }
  async getUserByEmail(email) { return userRepository.findByEmail(email); }
  async getUserByMnemonicId(mnemonic_id) { return userRepository.findByMnemonicId(mnemonic_id); }
}

module.exports = new UserService();
