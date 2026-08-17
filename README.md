# Wedding Invitation

Single-page invite: envelope open animation, countdown, event details (dress code +
schedule accordion), Google Maps/Calendar buttons, copyable hashtag, song-request
link, and an optional passphrase-gated photo album. No build step — plain HTML/CSS/JS.

## Customize

1. **`app.js` → `CONFIG` block** (top of file): names, event date/time (`eventISO`,
   include your UTC offset), venue + Maps link, hashtag, and the photo-album gate.
2. **`index.html`**: every place marked `<!-- EDIT: ... -->` — hero names, seal
   initials, date/venue text, dress code, schedule, Maps button, song-request form
   link, footer line.
3. **Music**: drop your own royalty-free `music.mp3` next to `index.html` (the one
   referenced by `<audio>` doesn't exist yet — add it or remove the music toggle
   button + `<audio>` tag from `index.html`).
4. **Song requests**: create a Google Form with a short-answer "song" field, then
   paste its `viewform` link into the "Recommend a song" button href.
5. **Photo gate** (optional): pick a passphrase, open the page in a browser, open
   devtools console, run `await __hash("your-secret-word")`, and paste the resulting
   hex string into `passphraseHash` in `CONFIG.gate`. Delete the `gate-section` from
   `index.html` if you don't want this feature at all.

## Deploy (GitHub Pages)

```bash
git init
git add .
git commit -m "Wedding invitation"
gh repo create wedding-invitation --public --source=. --push
```

Then in the repo's Settings → Pages, set source to the `main` branch (root). Your
page will be live at `https://<your-username>.github.io/wedding-invitation/`.
