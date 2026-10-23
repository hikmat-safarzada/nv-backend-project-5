const express = require("express");
const router = express.Router();
const {
    getRooms, getSingleRoom,
    createRoom, updateRoom, deleteRoom
} = require("../controllers/room.controller");
const verifyToken = require("../middleware/auth.middleware");
const authorizeAdmin = require("../middleware/authorize.admin");

router.get("/", verifyToken, getRooms);
router.get("/:roomId", verifyToken, getSingleRoom);
router.post("/", verifyToken, authorizeAdmin, createRoom)
router.patch("/:roomId", verifyToken, authorizeAdmin, updateRoom)
router.delete("/:roomId", verifyToken, authorizeAdmin, deleteRoom);

module.exports = router
