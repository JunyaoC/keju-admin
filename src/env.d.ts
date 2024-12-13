/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CLERK_SECRET_KEY: string;
  readonly PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  readonly PUBLIC_CLERK_JWT_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    auth: {
      userId: string;
      isProfileComplete: boolean;
    };
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
}
