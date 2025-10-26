// Simple test to check if the issue is with specific components
const { execSync } = require('child_process');

try {
  console.log('Testing build...');
  execSync('npx next build', { stdio: 'inherit' });
  console.log('Build successful!');
} catch (error) {
  console.error('Build failed:', error.message);
}
