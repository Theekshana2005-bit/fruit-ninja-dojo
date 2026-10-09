# 🍉 Fruit Ninja Dojo

> **A high-performance, responsive Fruit Ninja arcade game built with React, TypeScript, Vite, Tailwind CSS, and the Web Audio API.**  
> *Developed by **Theekshana** in collaboration with **Gemini AI**.*

---

## 🌟 Short GitHub Repo Description (Copy & Paste this into GitHub Repo About)

```text
A realistic Fruit Ninja arcade game with responsive 1:1 slicing physics, authentic katana & fruit sound effects, Chinese instrumental BGM, 3 game modes, and custom blade styles. Built with React & TypeScript.
```

**Topics / Tags:**  
`fruit-ninja`, `react`, `typescript`, `vite`, `tailwind-css`, `web-audio-api`, `canvas-game`, `arcade-game`, `game-development`, `html5-canvas`

---

## 🎮 Key Features

- **⚔️ Ultra-Responsive Katana Slicing:** 1:1 accurate slice tracking on mouse, trackpad, and touch devices with dynamic blade trail particles.
- **🔊 Realistic Sound Engine:** 
  - Dynamic aerodynamic katana blade whooshes with speed-reactive pitch modulation.
  - Multi-variety juicy fruit splats (Watermelon, Citrus, Apple, Melon).
  - Authentic battlefield bomb explosions and crackling gunpowder fuse sizzle.
  - Traditional bronze temple gong for Game Over.
- **🎵 Atmospheric Chinese Instrumental BGM:** High-fidelity Chinese background music (*"Year Of The Dragon"*) balanced at a gentle, comfortable volume level.
- **🕹️ 3 Engaging Game Modes:**
  - **Classic:** 3 lives system (`❤️ ❤️ ❤️`). Slicing bombs or dropping fruits deducts 1 life. Life healed every 100 points!
  - **Zen Mode:** 90 seconds of peaceful, bomb-free slicing bliss.
  - **Arcade Mode:** 60-second frenzy with Freeze, Frenzy, and 2X Double points special bananas!
- **🗡️ Custom Blade Collection:** Unlock and wield Classic Steel, Flame, Frost, Rainbow, and Shadow Katana blades.
- **🔒 Privacy Policy & About Sections:** Fully integrated bilingual (සිංහල & English) dialogs with zero personal data collection.

---

## 🚀 How to Deploy to GitHub Pages (Deploy කරන ආකාරය)

This project is already pre-configured for GitHub Pages:
- `vite.config.ts` uses relative base paths (`base: './'`).
- Audio files automatically resolve regardless of your repository URL.
- Automated GitHub Actions workflow is included at `.github/workflows/deploy.yml`.

### Step 1: Create a GitHub Repository
1. Log in to [GitHub](https://github.com).
2. Click **New Repository**.
3. Name it `fruit-ninja-dojo` (or any name you like).
4. Set it to **Public** and click **Create repository**.

### Step 2: Push Your Code to GitHub
Run the following commands in your project terminal:
```bash
git init
git add .
git commit -m "Initial commit - Fruit Ninja Dojo by Theekshana"
git branch -M main
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/fruit-ninja-dojo.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. On your GitHub repository page, click **Settings** (top bar).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.

### Step 4: Play Online!
Within 1-2 minutes, GitHub Actions will finish building your game.  
Your game will be live at:
👉 **`https://<YOUR-GITHUB-USERNAME>.github.io/fruit-ninja-dojo/`**

---

## 💻 Local Development Setup

To run the game locally on your computer:

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4
- **Graphics:** HTML5 Canvas (High-DPR calibrated)
- **Audio:** Web Audio API + HTML5 Audio
- **Icons:** Lucide React

---

## 👤 Author & Credits

- **Developer:** [Theekshana](https://github.com)
- **AI Assistance:** Built with [Gemini AI](https://deepmind.google/technologies/gemini/)
- **Background Music:** *"Year Of The Dragon"* by Steve Oxen (Fesliyan Studios)

---

## 📄 License

This project is open source and available under the [Apache-2.0 License](LICENSE).
