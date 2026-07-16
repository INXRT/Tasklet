const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let data = fs.readFileSync(filePath, 'utf8');
    let originalData = data;

    // Fix 1: Remove mix-blend-overlay (heavy on GPU)
    data = data.replace(/mix-blend-overlay/g, 'mix-blend-normal');

    // Fix 2: Replace expensive custom spring physics with a sleek, lightweight CSS ease
    data = data.replace(
      /type:\s*"spring",\s*stiffness:\s*300,\s*damping:\s*25,\s*mass:\s*0\.5/g,
      'duration: 0.4, ease: [0.23, 1, 0.32, 1]'
    );
    
    // Fix 3: For the date changer, 'layout' triggers massive re-renders on every date change.
    // We will just remove the 'layout' prop from the buttons inside AnimatePresence in the dashboards.
    // This requires specific replacements for DashboardClient and MobileDashboardClient
    if (filePath.includes('DashboardClient.tsx') || filePath.includes('MobileDashboardClient.tsx')) {
      data = data.replace(/<motion\.button\s*\n\s*layout\n/g, '<motion.button\n');
      // Just in case it's on the same line
      data = data.replace(/<motion\.button layout /g, '<motion.button ');
    }

    // Fix 4: Simplify modal background blurs. 
    // They are currently bg-black/60 backdrop-blur-sm. Sometimes they double stack.
    // For extreme performance, dropping backdrop blur on the modal *underlay* during transitions helps immensely.
    // We can replace 'backdrop-blur-sm' on the overlay with nothing, or leave it. 
    // Wait, the main lag is mostly from the spring transitions and the noise mix-blend. 
    
    if (data !== originalData) {
      fs.writeFileSync(filePath, data);
      console.log(`Patched ${filePath}`);
    }
  }
});
console.log('Done patching performance issues.');
