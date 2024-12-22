import fs from 'fs';

export function removeFolder(path) {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true });
  }
}
