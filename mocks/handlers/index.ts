import { authHandlers } from "./auth";
import { boardHandlers } from "./board";
import { postHandlers } from "./post";
import { fileHandlers } from "./file";

export const handlers = [
  ...authHandlers,
  ...boardHandlers,
  ...postHandlers,
  ...fileHandlers,
];
