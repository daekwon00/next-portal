import { authHandlers } from "./auth";
import { boardHandlers } from "./board";
import { postHandlers } from "./post";
import { fileHandlers } from "./file";
import { userHandlers } from "./user";
import { dashboardHandlers } from "./dashboard";
import { adminHandlers } from "./admin";

export const handlers = [
  ...authHandlers,
  ...boardHandlers,
  ...postHandlers,
  ...fileHandlers,
  ...userHandlers,
  ...dashboardHandlers,
  ...adminHandlers,
];
