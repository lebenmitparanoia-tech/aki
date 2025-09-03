# Homepage Client Patch

This sets `app/page.tsx` as a **Client Component** to avoid the prerender error:
`useState is not a function` during static export.

## Apply
```bash
unzip -o aki-home-client-patch.zip -d ~/aki
npm run build
pm2 restart aki
pm2 save
```
