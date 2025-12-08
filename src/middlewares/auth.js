const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting checked!");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (isAdminAuthorized) {
    next();
  } else {
    res.status(401).send("Admin is not Authorized");
  }
};

const userAuth = (req, res, next) => {
  console.log("User auth is getting checked!");
  const token = "xyz";
  const isUserAuthorized = token === "xyz";
  if (isUserAuthorized) {
    next();
  } else {
    res.status(401).send("User is not Authorized");
  }
};

module.exports = {
  adminAuth,
  userAuth
};
