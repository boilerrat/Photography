
# Film Shot Logger — Tech Spec (Next.js + shadcn)

## Goal
Simple web app to log film rolls and shot settings. Store to Markdown. Deploy on Vercel. No database.

## Non-goals
- No multi-user auth now.
- No complex image editing.
- No server DB.

## User stories
- You create a roll with metadata and a date.
- You add shots by number. You add date for each shot when known.
- You skip shot numbers when no data.
- You export to Markdown. You save to GitHub.
- You return later, import a prior Markdown file or load from GitHub.
- You switch light and dark mode.

## Stack
- Next.js 14, App Router, TypeScript.
- shadcn/ui components over Tailwind.
- zod for validation.
- Vercel for hosting and API routes.

## Data model
RollMeta
- rollId: string
- date: ISO string YYYY-MM-DD
- camera: string
- lens: string
- filmStock: string
- ratedISO: string
- meterISO: string
- exposures: number

Shot
- shotNumber: number
- date?: ISO string YYYY-MM-DD or ISO timestamp
- filmSpeed?: string
- aperture?: string
- exposureAdjustments?: string
- notes?: string
- imageUrl?: string

RollDoc
- meta: RollMeta
- shots: Shot[]

## Markdown format
- One file per roll.
- YAML front matter for meta including date.
- Section per shot with optional date.

Example
```markdown
---
rollId: "2025-10-26-hp5-kincardine-night"
date: "2025-10-26"
camera: "Canon AE-1 Program"
lens: "FD 50/1.8"
filmStock: "Ilford HP5"
ratedISO: "800"
meterISO: "800"
exposures: 36
---

# Shots

## Shot 1
Date: 2025-10-26
Film Speed: 800
Aperture: f/2.8
Exposure Adjustments: 1/60s, +1 EV, Y2 filter
Notes: Streetlamp by harbour
Image: https://i.imgur.com/abcd123.jpg

## Shot 3
Notes: Skipped Shot 2
```

## UI and components (shadcn)
Layout
- Header with app title, theme toggle, storage mode.
- Two panels: Roll form, Shots.

Roll form
- Input: rollId
- Input: camera
- Input: lens
- Input: filmStock
- Input: ratedISO
- Input: meterISO
- Number: exposures
- Date: roll date
- Actions: Save, Import from GitHub, Import from file

New Shot form
- Number: shotNumber
- Date: shot date
- Text: filmSpeed
- Text: aperture
- Text: exposureAdjustments
- Textarea: notes
- Input: imageUrl
- Button: Upload photo
- Button: Add or Replace

Shots list
- Card per shot. Show image thumbnail when available.
- Buttons: Delete, Edit.

shadcn components
- Button, Input, Textarea, Label, Select, Card, Switch, DropdownMenu.
- Date: Calendar + Popover pattern with react-day-picker.
- Theme: next-themes with ThemeToggle.

## Theme (light and dark)
- Use next-themes. Store choice in local storage.
- Toggle in header.
- Respect system preference on first load.

## Image handling
- Upload to Imgur with anonymous client id.
- Or paste any public URL.
- Save link to Markdown and render thumbnail in UI.

## Storage options
Download
- POST /api/save with storageMode=download.
- Response returns filename and content. Browser downloads .md.

GitHub
- POST /api/save with storageMode=github.
- PUT to GitHub Contents API. Path: rolls/<filename>.md.
- Return html_url.

Import from GitHub
- GET /api/import-github?path=rolls/<filename>.md.
- Read file. Parse. Hydrate UI.

Import from file
- Client reads .md file. Parse. Hydrate UI.

## Routes
- App Router pages
  - app/page.tsx main UI.
- API route handlers
  - app/api/save/route.ts POST.
  - app/api/import-github/route.ts GET.
  - app/api/upload-image/route.ts POST multipart to Imgur.
  - app/api/health/route.ts GET.

## Validation
- exposures 1 to 72.
- shotNumber 1 to exposures.
- dates
  - roll date required.
  - shot date optional.
  - ISO YYYY-MM-DD stored. Convert from Date object on submit.

## Files and naming
- Filename: YYYY-MM-DD-<film>-<slug>.md.
- Slug from rollId lowercased, hyphenated.

## Env vars (Vercel)
- GITHUB_REPO owner/name.
- GITHUB_TOKEN fine grained PAT with contents:write.
- GITHUB_BRANCH main.
- IMGUR_CLIENT_ID for anonymous uploads.

## MCP server for Cursor (shadcn)
Use shadcn MCP to speed UI work.
- Add to Cursor settings.
- Generate and update shadcn components.

cursor.json example
```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

## Accessibility
- Keyboard navigation for all inputs and popovers.
- Visible focus states.
- Form labels tied to inputs.
- Thumbnails include alt text.

## Security
- Do not expose tokens in client.
- GitHub and Imgur calls go through API routes.

## Performance
- Small client bundle.
- Lazy load date picker and image preview.

## QA checklist
- Create a roll with date and save to GitHub.
- Add shots with dates. Skip numbers. Export and re-import.
- Import older file and map fields.
- Theme toggle works and persists.
- Image upload returns a public URL and renders.

## Future
- Google Drive save.
- Per-roll list page.
- PWA offline cache.
- OAuth GitHub instead of PAT.
