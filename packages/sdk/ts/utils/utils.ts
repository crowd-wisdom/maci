import fs from "fs";
import os from "os";

/**
 * Check if we are running on an arm chip
 * @returns whether we are running on an arm chip
 */
export const isArm = (): boolean => os.arch().includes("arm");

/**
 * Remove a file
 * @param filepath - the path to the file
 */
export const unlinkFile = async (filepath: string): Promise<void> => {
  const isFileExists = fs.existsSync(filepath);

  if (isFileExists) {
    await fs.promises.unlink(filepath);
  }
};

/**
 * Pause the thread for n milliseconds
 * @param ms - the amount of time to sleep in milliseconds
 */
export const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
