import { IUserDocument } from "./users.types";
import bcrypt from "bcrypt";

export async function comparePassword(
  this: IUserDocument,
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password!);
}
