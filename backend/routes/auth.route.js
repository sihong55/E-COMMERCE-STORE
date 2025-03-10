import express from 'express';

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send("Sign up route coalled");
});


export default router;