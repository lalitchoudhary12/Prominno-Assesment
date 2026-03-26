const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const upload = require("../utils/multerConfig");
const { productSchema } = require("../validations/productValidation");
const {
  addProduct,
  getProducts,
  deleteProduct,
  getProductPDF
} = require("../controllers/productController");

router.post("/", auth(["seller"]), upload.array('images'), validate(productSchema), addProduct);
router.get("/", auth(["seller"]), getProducts);
router.delete("/:id", auth(["seller"]), deleteProduct);
router.get("/:id/pdf", auth(["seller"]), getProductPDF);

module.exports = router;