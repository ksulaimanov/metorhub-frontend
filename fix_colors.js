const fs = require('fs');
const filesToProcess = [
  'src/widgets/layout/PublicLayout.vue',
  'src/widgets/layout/PublicHeader.vue',
  'src/shared/ui/AppFooter.vue',
  'src/shared/ui/AppCard.vue',
  'src/shared/ui/AppButton.vue',
  'src/shared/ui/AppInput.vue',
  'src/shared/ui/AppField.vue',
  'src/pages/public/HomePage.vue',
  'src/pages/public/MentorDirectoryPage.vue',
  'src/features/mentor-directory/MentorCard.vue',
  'src/shared/ui/AuthSplitShell.vue',
  'src/pages/auth/LoginPage.vue'
];
function replaceColors(content) {
  return content
    // text colors
    .replace(/text-white/g, 'text-text-primary')
    .replace(/text-slate-200/g, 'text-text-secondary')
    .replace(/text-slate-300/g, 'text-text-secondary')
    .replace(/text-slate-400/g, 'text-text-muted')
    // bgs
    .replace(/bg-white\/5/g, 'bg-surface')
    .replace(/bg-white\/10/g, 'bg-surface-secondary')
    // borders
    .replace(/border-white\/10/g, 'border-border-brand')
    .replace(/border-white\/5/g, 'border-border-subtle')
    // buttons
    .replace(/bg-\[#6b21a8\]/g, 'bg-brand')
    .replace(/hover:bg-\[#581c87\]/g, 'hover:bg-brand-hover');
}
for (const file of filesToProcess) {
  if (fs.existsSync(file)) {
    const oldContent = fs.readFileSync(file, 'utf8');
    const newContent = replaceColors(oldContent);
    if (oldContent !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated ' + file);
    }
  } else {
    console.log('Not found ' + file);
  }
}
