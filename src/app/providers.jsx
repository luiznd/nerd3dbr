"use client";

import React from 'react';
import { AuthProvider } from '../presentation/contexts/AuthContext';

export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

