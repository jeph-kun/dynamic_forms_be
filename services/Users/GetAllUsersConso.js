const Users = require("../../models/Users");

module.exports = async (skip, limit, name) => {
  try {

    const regex = new RegExp(`^${name}`, 'i');

    let userList = await Users.find(name.length > 0 ? { $or: [{ firstName: { $regex: regex } },{ lastName: { $regex: regex } }] } : {}).skip(skip).limit(limit);
    const totalUsers = await Users.countDocuments(name.length > 0 ? { $or: [{ firstName: { $regex: regex } },{ lastName: { $regex: regex } }] } : {});
    return { userList, totalUsers }

  } catch (error) {
    return false;
  }
};


