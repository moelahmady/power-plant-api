import { Request, Response, NextFunction } from 'express';

export function validateQuery(req: Request, res: Response, next: NextFunction) {
  const count = req.query.count;
  const state = req.query.state;

  if (typeof count !== 'string' || isNaN(Number(count)) || Number(count) < 1) {
    return res.status(400).json({ error: 'Invalid count parameter. It must be a positive integer.' });
  }

  if (state && !isNaN(Number(state))) {
    return res.status(400).json({ error: 'Invalid state parameter. It must be a string.' });
  }

  next();
}