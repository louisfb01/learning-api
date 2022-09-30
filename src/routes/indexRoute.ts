import { Router, Request, Response } from 'express';

const router = Router()

// Basic Pinging Endpoint (to test connection)
router.get('/', (req: Request, res: Response) => {
  res.json({ "status": "connected" })
})

export default router;