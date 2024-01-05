import User from '../models/user.js';

export const save = async (newUser) => {
    const user = new User(newUser);
    return user.save();
}

export const search = async (params={}) => {
    const requiredUser = await User.find(params).exec();
    return requiredUser;
}

export const allData = async () => {
    return User.find({});
}

export const update = async( userUpdates, id) =>{
    const updates = await User.findByIdAndUpdate(id, userUpdates).exec();
    return updates;
}