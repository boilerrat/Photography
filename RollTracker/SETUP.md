# Film Shot Logger - Setup Instructions

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# GitHub Configuration
GITHUB_REPO=owner/repo-name
GITHUB_TOKEN=your-fine-grained-pat-with-contents-write
GITHUB_BRANCH=main

# Imgur Configuration
IMGUR_CLIENT_ID=your-imgur-client-id
```

## GitHub Setup

1. Create a GitHub repository for storing your film rolls
2. Create a fine-grained Personal Access Token with `Contents: Write` permission
3. Set the `GITHUB_REPO` to your repository in format `owner/repo-name`
4. Set the `GITHUB_TOKEN` to your PAT

## Imgur Setup

1. Go to https://api.imgur.com/oauth2/addclient
2. Create a new application (anonymous uploads)
3. Copy the Client ID and set it as `IMGUR_CLIENT_ID`

## Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- ✅ Create and manage film rolls with metadata
- ✅ Add shots with detailed information
- ✅ Upload images to Imgur
- ✅ Save rolls as Markdown files (download or GitHub)
- ✅ Import existing rolls from files or GitHub
- ✅ Light/dark theme toggle
- ✅ Mobile-friendly responsive design
- ✅ Form validation with Zod

## Usage

1. Fill in the roll information (camera, lens, film stock, etc.)
2. Add shots with their details
3. Upload images or paste image URLs
4. Save to download as Markdown or upload to GitHub
5. Import existing rolls to continue editing
