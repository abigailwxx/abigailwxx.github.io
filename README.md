# Abigail Wang — portfolio website

This folder is the whole website. It was built from the Figma design file (abi-website) and runs without any app or account.

## Look at it
Double-click `index.html` to open it in your browser. (Videos and the résumé check work best once it's online.)

## Before you publish — fill in your links
Open `site.js` in any text editor (TextEdit works). At the top, fill in the links:

```
resume:    'resume.pdf',     ← put your résumé PDF in this folder and name it resume.pdf
linkedin:  '',               ← paste your LinkedIn URL between the quotes
instagram: '',
emojinary: '',               ← "Explore the Website" on Emojinary
between:   '',               ← "Explore the Website" on Between Languages
krakk:     '',               ← the KRAKK mobile site (QR code)
```
Any link left empty simply does nothing when clicked.

## Videos (optional)
The Commons and What Design Can't Do pages show a still image where your Figma file has video. To make them play, export the videos as MP4 and drop them in the `media` folder with these names:
`commons-video-1.mp4`, `commons-video-2.mp4`, `commons-zine.mp4`, `what-design-cant-do.mp4`.

## Publish (free, link never changes)
Easiest: go to **app.netlify.com/drop**, drag this whole folder onto the page, and you get a live link right away. Create a free account to keep it, rename it (e.g. abigailwang.netlify.app), and later connect your own domain (Site settings → Domain management).
To update the site later, drag the folder onto the same site's **Deploys** tab — the link stays the same.

## Pages
| File | Page |
|---|---|
| index.html | Home |
| projects.html | Projects (dice + gallery) |
| about.html | About & Contact |
| emojinary.html, commons.html, krakk.html, what-design-cant-do.html, between-languages.html, wireless.html | Case studies |

## What's interactive
- Hover lifts on every button, nav pill and project card
- Sections fade up as you scroll
- Home: the die under your name bobs; click it and it rolls into the Projects page
- Projects: **Roll the dice** tumbles the big die, picks a category (Branding / Editorial / Web Design / Other Works), highlights it and dims the other projects. Clicking a category does the same; **Show all** resets.
- Phones and small windows get a stacked, single-column layout automatically.
