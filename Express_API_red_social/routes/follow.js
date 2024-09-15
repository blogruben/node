const express = require("express");
const router = express.Router();
const FollowContoller = require("../controllers/follow");
const check = require("../middleware/auth");

// Definir rutas
router.get("/prueba-follow", FollowContoller.pruebaFollow);
router.post("/save", check.auth, FollowContoller.save);
router.delete("/unfollow/:id", check.auth, FollowContoller.unfollow);
router.get("/following/:id?/:page?", check.auth, FollowContoller.following);
router.get("/followers/:id?/:page?", check.auth, FollowContoller.followed);


// Exportar router
module.exports = router;