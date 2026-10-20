import { Request, Response } from 'express';
import { registerCompanyWithAdmin, loginUser } from '../services/auth.service';

/**
 * POST /api/auth/register
 * Registers a new company along with its initial Admin user.
 */
export const registerCompany = async (
  req: Request,
  res: Response
) => {
  try {
    const { companyName, name, email, password } = req.body as {
      companyName?: string;
      name?: string;
      email?: string;
      password?: string;
    };

    // Basic Input Validation
    if (!companyName || !name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide companyName, name, email, and password',
      });
    }

    // Invoke Service
    const { company, user, token } = await registerCompanyWithAdmin(companyName, {
      name,
      email,
      password,
    });

    // Strip password from user response
    const userObj = user.toObject ? user.toObject() : user;
    delete (userObj as { password?: string }).password;

    return res.status(201).json({
      message: 'Company and Admin user registered successfully',
      data: {
        company,
        user: userObj,
        token,
      },
    });
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email or company domain already exists' });
    }
    return res.status(400).json({ message: err.message || 'Registration failed' });
  }
};

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token.
 */
export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    // Basic Input Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password',
      });
    }

    // Invoke Service
    const { user, token } = await loginUser(email, password);

    // Strip password from user response
    const userObj = user.toObject ? user.toObject() : user;
    delete (userObj as { password?: string }).password;

    return res.status(200).json({
      message: 'Login successful',
      data: {
        user: userObj,
        token,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(401).json({ message: err.message || 'Invalid credentials' });
  }
};