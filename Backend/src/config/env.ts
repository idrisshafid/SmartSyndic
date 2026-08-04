import "dotenv/config";
function required(name: string): string {
  const value = process.env[name];
  
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
   
  databaseUrl: required("DATABASE_URL"),
  pgHost: required("PGHOST"),
  pgPort: Number(required("PGPORT")),
  pgUser: required("PGUSER"),
  pgPassword: required("PGPASSWORD"),
  pgDatabase: required("PGDATABASE"),
  jwtSecret: required("JWT_SECRET"),
} as const;