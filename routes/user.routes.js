const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require('multer')
const upload = multer()

//auth
router.post("/register", authController.signUp );
router.post("/login", authController.signIn );
router.get("/logout", authController.logout );

// user display
router.get("/", userController.getAllUsers );
router.get("/:id", userController.userInfo );

// update
router.put("/:id", userController.updateUser);
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);
//router.patch("/unfollow/:id", userController.unfollow);

//delete

router.delete("/:id", userController.deleteUser);

//UPLOAD
router.post('/upload', upload.single('file'), uploadController.uploadProfil)


// export
module.exports = router;


