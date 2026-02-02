# 🚀 SinzTools - Free Privacy-First Online Tools for Images & PDFs

<div align="center">

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fwww.sinztools.app&style=for-the-badge)](https://www.sinztools.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/ngtrend/sinztools?style=for-the-badge)](https://github.com/ngtrend/sinztools/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)

**[Visit Website](https://www.sinztools.app)** • **[Report Bug](https://github.com/ngtrend/sinztools/issues)** • **[Request Feature](https://github.com/ngtrend/sinztools/issues)**

</div>

---

## 📖 About SinzTools

**SinzTools** is a free, open-source collection of privacy-first online tools for **image conversion**, **image compression**, **PDF manipulation**, and everyday utilities — all running **100% locally in your browser**.

🔒 **No uploads. No tracking. No servers.** Your files never leave your device.

Perfect for:
- 🎨 **Designers** - Quick image format conversions and compression
- 💼 **Professionals** - Merge PDFs, convert documents, resize images
- 🎓 **Students** - Free tools for projects and assignments
- 👨‍💻 **Developers** - Fast utilities without API dependencies
- 🌐 **Privacy-conscious users** - All processing happens locally

---

## ✨ Features

- ✅ **100% Client-Side** - All tools run in your browser using JavaScript
- ✅ **No File Uploads** - Your files stay on your device
- ✅ **Completely Free** - No registration, no subscriptions, no paywalls
- ✅ **Privacy-First** - Zero tracking, zero data collection
- ✅ **Fast & Lightweight** - Minimal dependencies, instant processing
- ✅ **Mobile-Friendly** - Works on all devices and screen sizes
- ✅ **Offline Capable** - Works without internet once loaded
- ✅ **No Ads** - Clean, distraction-free interface

---

## 🛠️ Available Tools

### 📷 Image Tools

| Tool | Description | Keywords |
|------|-------------|----------|
| [**Image Compressor**](https://www.sinztools.app/tools/image-compressor/) | Reduce image file size by up to 90% without quality loss | compress image, optimize images, reduce file size |
| [**Image Converter**](https://www.sinztools.app/tools/image-converter/) | Convert between PNG, JPG, WEBP formats | image converter, format conversion |
| [**Image Resizer**](https://www.sinztools.app/tools/image-resizer/) | Resize images to custom dimensions or presets | resize image, change image size, scale image |
| [**Image Crop**](https://www.sinztools.app/tools/image-crop/) | Crop images to custom areas | crop image, trim image, cut image |
| [**PNG to JPG**](https://www.sinztools.app/tools/png-to-jpg/) | Convert PNG images to JPG/JPEG format | png to jpg, png to jpeg converter |
| [**PNG to WEBP**](https://www.sinztools.app/tools/png-to-webp/) | Convert PNG to modern WEBP format | png to webp converter |
| [**JPG to WEBP**](https://www.sinztools.app/tools/jpg-to-webp/) | Convert JPG to WEBP for better compression | jpg to webp, jpeg to webp |
| [**WEBP to JPG**](https://www.sinztools.app/tools/webp-to-jpg/) | Convert WEBP images to JPG for compatibility | webp to jpg converter |
| [**WEBP to PNG**](https://www.sinztools.app/tools/webp-to-png/) | Convert WEBP to PNG with transparency support | webp to png converter |
| [**Favicon Generator**](https://www.sinztools.app/tools/favicon-generator/) | Create favicons from images in multiple sizes | favicon generator, create favicon |
| [**Image Watermark**](https://www.sinztools.app/tools/image-watermark/) | Add text watermarks to protect your images | watermark image, add watermark |

### 📄 PDF Tools

| Tool | Description | Keywords |
|------|-------------|----------|
| [**PDF Merge**](https://www.sinztools.app/tools/pdf-merge/) | Combine multiple PDF files into one document | merge pdf, combine pdf, join pdf files |
| [**PDF Split**](https://www.sinztools.app/tools/pdf-split/) | Extract specific pages from PDF documents | split pdf, extract pdf pages |
| [**Image to PDF**](https://www.sinztools.app/tools/image-to-pdf/) | Convert images to PDF documents | image to pdf, jpg to pdf, png to pdf |

### 🎥 Video Tools

| Tool | Description | Keywords |
|------|-------------|----------|
| [**Video Compressor**](https://www.sinztools.app/tools/video-compressor/) | Reduce video file size for faster sharing | compress video, reduce video size |
| [**Video to GIF**](https://www.sinztools.app/tools/video-to-gif/) | Convert videos to animated GIF files | video to gif, make gif from video |

---

## 🚀 Quick Start

Simply visit **[www.sinztools.app](https://www.sinztools.app)** and choose your tool. No installation or setup required!

### For Developers - Run Locally

```bash
# Clone the repository
git clone https://github.com/ngtrend/sinztools.git

# Navigate to project
cd sinztools

# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build
```

---

## 🏗️ Tech Stack

- **Frontend Framework**: [Eleventy (11ty)](https://www.11ty.dev/) - Static site generator
- **Languages**: HTML5, CSS3, Vanilla JavaScript
- **Libraries**: 
  - PDF.js for PDF manipulation
  - Canvas API for image processing
  - Web3Forms for contact form
- **Hosting**: Vercel
- **Build Tool**: npm

---

## 📂 Project Structure

```
sinztools/
├── src/
│   ├── _data/           # Tool configurations
│   ├── _includes/       # Reusable components (nav, footer)
│   ├── _layouts/        # Page layouts (base, tool)
│   ├── assets/          # Static assets
│   │   ├── css/         # Stylesheets
│   │   ├── js/          # Tool scripts
│   │   └── icons/       # Icons and images
│   └── tools/           # Individual tool pages
│       ├── image-compressor/
│       ├── png-to-jpg/
│       └── ...
├── _site/               # Generated static files
└── package.json         # Dependencies
```

---

## 🎯 SEO & Architecture

SinzTools is built with SEO-first principles:

### URL Structure
- Clean, keyword-based URLs: `/tools/<tool-name>/`
- Examples: `/tools/png-to-jpg/`, `/tools/image-compressor/`

### On-Page SEO
- ✅ Optimized `<title>` tags with primary keywords
- ✅ Compelling `<meta description>` for high CTR
- ✅ Semantic HTML with proper heading hierarchy (H1, H2, H3)
- ✅ Schema.org structured data (WebApplication, BreadcrumbList, FAQPage)
- ✅ Mobile-first responsive design
- ✅ Fast loading times (<2s)

### Content Strategy
- One page = one tool = one search intent
- Comprehensive FAQs on each tool page
- Internal linking between related tools
- Keyword-rich descriptions without over-optimization

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-tool`
3. **Commit your changes**: `git commit -m 'Add new tool: XYZ'`
4. **Push to branch**: `git push origin feature/new-tool`
5. **Open a Pull Request**

### Adding a New Tool

1. Add tool configuration to `src/_data/tools.json`
2. Create tool directory: `src/tools/your-tool-name/`
3. Create `index.njk` with tool layout
4. Add JavaScript functionality: `src/assets/js/your-tool.js`
5. Test locally with `npm start`
6. Submit PR with description

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Support the Project

If you find SinzTools useful, please:

- ⭐ **Star this repository** on GitHub
- 🐦 **Share on Twitter/X** with hashtag #SinzTools
- 🔗 **Share with friends** and colleagues
- 🐛 **Report bugs** to help improve the tools
- 💡 **Suggest features** for new tools

---

## 📞 Contact

- **Website**: [www.sinztools.app](https://www.sinztools.app)
- **Email**: contact@sinztools.app
- **Issues**: [GitHub Issues](https://github.com/ngtrend/sinztools/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ngtrend/sinztools/discussions)

---

## 🎨 Design Philosophy

SinzTools follows these core principles:

### Simplicity
- One tool = one page = one purpose
- Clean UI with minimal distractions
- Clear instructions and immediate feedback

### Speed
- Frontend-only processing (no backend delays)
- Lightweight codebase (no heavy frameworks)
- Optimized assets and lazy loading

### Privacy
- No file uploads to servers
- No user tracking or analytics beyond basic stats
- No cookies or local storage of user data
- Complete transparency in code

### Accessibility
- Mobile-first responsive design
- Keyboard navigation support
- Screen reader friendly
- High contrast and readable fonts

---

## 🚀 Roadmap

### Current Focus
- ✅ Core image conversion tools
- ✅ PDF manipulation tools
- ✅ Video tools (compressor, GIF converter)
- 🔄 Performance optimizations
- 🔄 Expanded tool coverage

### Upcoming Features
- 📅 Batch processing for multiple files
- 📅 Advanced image editing (filters, effects)
- 📅 Document converters (DOCX, XLSX)
- 📅 QR code generator
- 📅 Color palette generator
- 📅 Text utilities (word counter, case converter)

### Long-Term Vision
- 🌍 Multi-language support (i18n)
- 🎨 Theme customization
- 📱 Progressive Web App (PWA)
- 🔌 Browser extension
- 📊 Usage analytics dashboard (privacy-respecting)

---

## 📊 Stats & Recognition

- 🌐 **Website**: [www.sinztools.app](https://www.sinztools.app)
- 🛠️ **17+ Tools** available
- 🚀 **100% Browser-Based** processing
- 🔒 **Zero Data Collection**
- ⚡ **Sub-2s Load Time**

---

## 💡 Why SinzTools?

### The Problem
Most online tools require uploading your files to servers, raising privacy concerns. They often have:
- File size limits
- Slow upload/download times
- Subscription paywalls
- Privacy risks
- Annoying ads

### The Solution
SinzTools processes everything **locally in your browser** using JavaScript:
- ✅ No file uploads = instant privacy
- ✅ No file size limits (within browser memory)
- ✅ No waiting for uploads/downloads
- ✅ Completely free forever
- ✅ Clean, ad-free interface

---

## 🙏 Acknowledgments

Built with:
- [Eleventy](https://www.11ty.dev/) - Static site generator
- [PDF-lib](https://pdf-lib.js.org/) - PDF manipulation
- [Web3Forms](https://web3forms.com/) - Contact form handling
- Icons from [Heroicons](https://heroicons.com/)

Inspired by the need for simple, privacy-respecting online tools.

---

<div align="center">

**[⬆ Back to Top](#-sinztools---free-privacy-first-online-tools-for-images--pdfs)**

Made with ❤️ for the web

© 2026 SinzTools. All rights reserved.

</div>
