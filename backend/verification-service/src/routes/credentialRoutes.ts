import { Router } from "express";
import { CredentialController } from "../controllers/CredentialController";

const router = Router();
const credentialController = new CredentialController();

// POST /verify - Verify a credential
router.post("/verify", (req, res) => {
  credentialController.verifyCredential(req, res);
});

// POST /sync-credential - Sync credential from issuance service
router.post("/sync-credential", (req, res) => {
  credentialController.syncCredential(req, res);
});

// GET /health - Health check endpoint
router.get("/health", (req, res) => {
  credentialController.getHealthStatus(req, res);
});

export default router;
