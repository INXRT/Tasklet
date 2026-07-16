const fs = require('fs');
const path = 'src/components/ui/ScaleWrapper.tsx';
let data = fs.readFileSync(path, 'utf8');

// Fix 1: Add overflow-hidden and remove transition-transform duration-100 ease-out
data = data.replace(
  "className={`relative transition-transform duration-100 ease-out ${isMobile ? '' : 'origin-center'} max-w-[100vw] overflow-x-hidden`}",
  "className={`relative ${isMobile ? '' : 'origin-center overflow-hidden'} max-w-[100vw] overflow-x-hidden`}"
);

fs.writeFileSync(path, data);
console.log('Fixed ScaleWrapper');
