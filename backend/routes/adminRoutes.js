const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { createSellerSchema } = require("../validations/sellerValidation");
const { createSeller, getSellers } = require("../controllers/adminController");

router.post("/create-seller", auth(["admin"]), validate(createSellerSchema), createSeller);
router.get("/sellers", auth(["admin"]), getSellers);

module.exports = router;