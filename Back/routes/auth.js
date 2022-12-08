const express=require("express");
const { registroUsuario, loginUser, logOut, forgotPassword, resetPassword } = require("../controllers/authController");
const router= express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");

router.route('/usuario/registro').post(registroUsuario)
router.route('/login').get(loginUser)
router.route('/logout').get(isAuthenticatedUser, logOut)
router.route("/forgotPassword").post(forgotPassword)
router.route('/resetPassword/:token').post(resetPassword)

module.exports= router