import { AuthPayload } from "./user.types";

declare global {

  namespace Express {

    interface Request { user?: AuthPayload; }
  }}

export {};
