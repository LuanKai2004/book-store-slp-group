/**
 * Interface cho JWT Payload
 */
export interface JwtPayload {
  email: string;
  sub: number; // user id
  role: string; // user role
}