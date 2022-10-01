const express = require("express");
const userController = require("../controller/userController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", userController.signup);
router.get("/login", userController.login);
router.get("/show", auth, userController.show);
router.put("/update", auth, userController.update);
router.delete("/remove", auth, userController.remove);

module.exports = router;
