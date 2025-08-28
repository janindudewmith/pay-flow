// Custom build script for Vercel
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting custom Vercel build script');

// Change to frontend directory
process.chdir(path.join(__dirname));
console.log('Current directory:', process.cwd());

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Run build using npx to ensure vite is found
console.log('Building frontend...');
try {
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
