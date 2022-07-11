import { JwtPayload } from 'jsonwebtoken';
export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}
export interface TokenPayload extends JwtPayload {
  id: number;
  type: number;
}
