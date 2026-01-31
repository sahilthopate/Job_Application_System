const recruiterOnly = (req, res, next) => {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({ message: "Recruiter access only" });
  }
  next();
};

const userOnly = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "User access only" });
  }
  next();
};

export default { recruiterOnly , userOnly }
