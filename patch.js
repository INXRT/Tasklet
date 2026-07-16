const fs = require('fs');

const files = [
  'src/components/ui/TaskModal.tsx',
  'src/components/ui/ShopModal.tsx',
  'src/components/ui/InventoryModal.tsx',
  'src/components/ui/PokemonRosterModal.tsx'
];

files.forEach(f => {
  let data = fs.readFileSync(f, 'utf8');
  data = data.replace(
    'className="w-full h-full flex items-center justify-center pointer-events-none"',
    'className="w-full h-full flex items-center justify-center pointer-events-none p-4 md:p-8"'
  );
  fs.writeFileSync(f, data);
});
console.log('done');
