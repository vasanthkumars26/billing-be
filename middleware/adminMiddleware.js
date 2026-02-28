module.exports = (req, res, next) => {
  const ADMIN_UID = "ntPZ8y7lIkWhnQCMaY0rpK4LB8x2";

  if (req.user.uid !== ADMIN_UID) {
    return res.status(403).json({ message: "Not admin" });
  }

  next();
};