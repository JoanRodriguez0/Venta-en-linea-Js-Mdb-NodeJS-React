const express=require("express");
const { newOrder, viewOrder, myOrders, allOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router=express.Router();

router.route("/order/new").post(isAuthenticatedUser,newOrder)
router.route("/order/view/:id").get(isAuthenticatedUser,viewOrder)
router.route("/order/me").get(isAuthenticatedUser, myOrders)

//Admin
router.route("/admin/allOrders").get(isAuthenticatedUser,authorizeRoles("admin"),allOrders)
router.route("/admin/editOrder/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder)
router.route("/admin/deleteOrder/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)



module.exports=router;