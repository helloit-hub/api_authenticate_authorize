const { registerUser, loginUser, userProfile } = require("../controller/user");
const auth = require("../middleware/authmiddleware");

const router = require("express").Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, userProfile);

module.exports = router;
