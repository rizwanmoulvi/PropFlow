// SignInButton.js

import React from 'react';
import { authenticate } from "@onflow/fcl"

const SignInButton = () => {
  const handleSignIn = async () => {
    await authenticate();
  };

  return (
    <button onClick={handleSignIn}>
      Sign In
    </button>
  );
};

export default SignInButton;