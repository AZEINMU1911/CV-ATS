const express = require("express")
const { UserController } = require("../controllers/userController")
const { CvController } = require("../controllers/cvController")
const authenticate = require("../middlewares/authentication")
const upload = require("../middlewares/upload")
const { AnalysisController } = require("../controllers/analysisController")
const route = express.Router()


route.post("/login", UserController.login)
route.post("/register", UserController.register)
route.post("/google-login", UserController.googleLogin)

route.get('/cvs', authenticate, CvController.getAllCvs);
route.post("/cvs/upload", authenticate, upload.single('cv'), CvController.uploadCV)

route.get("/analyze/:cvId",authenticate,AnalysisController.getLatestAnalysis)
route.post("/analyze/:cvId", authenticate, AnalysisController.analyzeCv)
route.delete('/cvs/:cvId', authenticate, CvController.deleteCv);


module.exports = route