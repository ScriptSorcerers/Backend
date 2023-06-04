const { User } = require('../Models');
const {
    checkDuplicateEmail,
    checkDuplicatePhone,
    checkDuplicateUsername,
} = require("./Auth");
const bcrypt = require("bcrypt");

const getOwnProfile = async (req, res) => {
    let id = req.USER.id;
    let user = await User.findById(id).select("-password");

    user = user.toObject();
    console.log(user);

    if (user) {
        return res.json({ message: "user profile", data: user });
    } else {
        return res.status(400).json({ message: "No Such User" });
    }
}


const getProfileOfOtherUser = async (req, res) => {
    let username = req.params?.username;
    if (!username) return res.status(400).json({ message: "username missing" });
    let user = await User.findOne({ username }).select("-password");
    if (user) {

        user = user.toObject();

        return res.json({ message: "user profile", data: user });
        
    } else {
        return res.status(400).json({ message: "No Such User" });
    }
}

const getAllUsers = async (req, res) => {
    const { q } = req.query;
    let searchObj = {};
    if (q) searchObj = { username: { $regex: q, $options: 'i' } };
    let users = await User.find(searchObj).select("-password").exec();
    return res.json({ message: "all users", data: users });
}

const editProfile = async (req, res) => {
    let id = req.USER.id;
    let { name, email, phone, profilePic, description, username } = req.body;
    let user = await User.findById(id);
    if (user) {
        user.name = name || user.name;
        if (email !== user.email) {
            if (await checkDuplicateEmail(email)) {
                return res.status(400).json({ message: "email already exists" });
            }
            user.email = email;
        }
        if (phone !== user.phone) {
            if (await checkDuplicatePhone(phone)) {
                return res.status(400).json({ message: "phone already exists" });
            }
            user.phone = phone;
        }
        user.profilePic = profilePic || user.profilePic;
        user.description = description || user.description;
        if (username !== user.username) {
            if (await checkDuplicateUsername(username)) {
                return res.status(400).json({ message: "username already exists" });
            }
            user.username = username;
        }
        await user.save();
        return res.json({ message: "profile updated" });
    } else {
        return res.status(400).json({ message: "No Such User" });
    }
}

const changePassword = async (req, res) => {
    let id = req.USER.id;
    let { oldPassword, newPassword } = req.body;
    let user = await User.findById(id);
    if (user) {
        if (await bcrypt.compare(oldPassword, user.password)) {
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            return res.json({ message: "password changed" });
        } else {
            return res.status(400).json({ message: "old password is incorrect" });
        }
    } else {
        return res.status(400).json({ message: "No Such User" });
    }
}

const deleteProfile = async (req, res) => {
    let id = req.USER.id;
    let user = await User.findById(id);
    if (user) {
        await User.findByIdAndDelete(id).exec();
    } else {
        return res.status(400).json({ message: "No Such User" });
    }
}

const forgotPassword = async (req, res) => {
    let { email, username, phone } = req.body;
    let user;
    if (email) {
        user = await User.findOne({ email });
    } else if (username) {
        user = await User.findOne({ username });
    } else if (phone) {
        user = await User.findOne({ phone });
    } else {
        return res.status(400).json({ message: "email, username or phone is required" });
    }
    if (user) {
        let otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        await user.save();
        // send otp to user
        return res.json({ message: "otp sent" });
    } else {
        return res.status(400).json({ message: "No Such User" });

    }
}

const resetPassword = async (req, res) => {
    let { email, username, phone, otp, newPassword } = req.body;
    let user;
    if (email) {
        user = await User.findOne({ email });
    } else if (username) {
        user = await User.findOne({ username });
    } else if (phone) {
        user = await User.findOne({ phone });
    } else {
        return res.status(400).json({ message: "email, username or phone is required" });
    }
    if (user) {
        if (user.otp === otp) {
            user.password = await bcrypt.hash(newPassword, 10);
            user.otp = undefined;
            await user.save();
            return res.json({ message: "password changed" });
        } else {
            return res.status(400).json({ message: "otp is incorrect" });
        }
    } else {
        return res.status(400).json({ message: "No Such User" });
    }
}






module.exports = {
    getOwnProfile,
    getProfileOfOtherUser,
    getAllUsers,
    editProfile,
    changePassword,
    deleteProfile,
    forgotPassword,
    resetPassword,
}

