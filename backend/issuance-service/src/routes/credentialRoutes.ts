import { Router } from "express";
import { CredentialController } from "../controllers/CredentialController";

const router = Router();
const credentialController = new CredentialController();

// POST /issue - Issue a new credential
router.post("/issue", (req, res) => {
  credentialController.issueCredential(req, res);
});

// GET /credential/:id - Get credential by ID
router.get("/credential/:id", (req, res) => {
  credentialController.getCredentialById(req, res);
});

// GET /health - Health check endpoint
router.get("/health", (req, res) => {
  credentialController.getHealthStatus(req, res);
});

export default router;
