# Professional Barcode Generator

A comprehensive, industry-grade barcode generator built with React that supports multiple barcode formats and provides professional-quality output suitable for commercial use.

## 🚀 Live Demo

**[Try it now!](https://claude.ai/public/artifacts/f092e238-9525-4db9-9ca5-fdbeb1510730)**

## ✨ Features

### Barcode Formats Supported
- **Code 128** - Most versatile format supporting all ASCII characters
- **EAN-13** - International retail standard (13 digits with automatic checksum)
- **UPC-A** - North American retail standard (12 digits with automatic checksum)
- **Code 39** - Alphanumeric format widely used in industry

### Professional Features
- 🎨 **Customizable Design** - Adjust colors, dimensions, and styling
- 📏 **Precise Control** - Fine-tune bar width, height, margins, and font sizes
- 💾 **Multiple Export Options** - Download as PNG or copy to clipboard
- ✅ **Real-time Validation** - Automatic error checking and format validation
- 🔢 **Automatic Checksums** - Built-in checksum calculation for EAN-13 and UPC-A
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🖨️ **Print Ready** - High-resolution output suitable for professional printing

## 🏭 Industry Applications

- **Retail & E-commerce** - Product labeling and inventory management
- **Manufacturing** - Parts identification and tracking systems
- **Healthcare** - Patient and medication tracking
- **Logistics** - Package and shipment identification
- **Asset Management** - Equipment and inventory tracking

## 🛠️ Technology Stack

- **React 18** with Hooks
- **HTML5 Canvas** for barcode rendering
- **Tailwind CSS** for modern styling
- **Lucide React** for icons
- **Vanilla JavaScript** barcode algorithms

## 📋 Requirements

- Node.js 16+ 
- Modern web browser with HTML5 Canvas support
- Internet connection (for web fonts and icons)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/professional-barcode-generator.git
cd professional-barcode-generator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

### 4. Open in Browser
Navigate to `http://localhost:3000` to see the application.

## 📦 Installation

### Using npm
```bash
npm install professional-barcode-generator
```

### Using yarn
```bash
yarn add professional-barcode-generator
```

## 💡 Usage

### Basic Usage
1. Enter your data in the input field
2. Select the desired barcode format
3. Customize appearance using the controls
4. Download or copy the generated barcode

### Supported Data Formats

#### Code 128
- Supports all ASCII characters (0-127)
- Variable length
- High data density
- Example: `"Hello World123"`

#### EAN-13
- 12 or 13 digits (checksum auto-calculated)
- International product identification
- Example: `"123456789012"`

#### UPC-A
- 11 or 12 digits (checksum auto-calculated)
- North American product identification
- Example: `"12345678901"`

#### Code 39
- Alphanumeric characters (A-Z, 0-9, and some symbols)
- Self-checking format
- Example: `"PRODUCT123"`

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | string | `"123456789012"` | Data to encode |
| `barcodeType` | string | `"code128"` | Barcode format |
| `width` | number | `2` | Bar width in pixels |
| `height` | number | `100` | Barcode height in pixels |
| `fontSize` | number | `14` | Text size in pixels |
| `showText` | boolean | `true` | Display text below barcode |
| `backgroundColor` | string | `"#ffffff"` | Background color |
| `foregroundColor` | string | `"#000000"` | Bar color |
| `margin` | number | `10` | Margin around barcode |

## 📐 Barcode Specifications

### Code 128
- **Character Set**: Full ASCII (128 characters)
- **Check Digit**: Modulo 103 checksum
- **Density**: High (11 bars per character)
- **Applications**: Shipping, packaging, general purpose

### EAN-13
- **Character Set**: Numeric (0-9)
- **Length**: 13 digits (including check digit)
- **Check Digit**: Modulo 10 checksum
- **Applications**: Retail products, books, magazines

### UPC-A
- **Character Set**: Numeric (0-9)
- **Length**: 12 digits (including check digit)
- **Check Digit**: Modulo 10 checksum
- **Applications**: Retail products in North America

### Code 39
- **Character Set**: 43 characters (A-Z, 0-9, -, ., space, *, $, /, +, %)
- **Check Digit**: Optional modulo 43
- **Density**: Low (13 bars per character)
- **Applications**: Automotive, defense, healthcare

## 🔧 API Reference

### Core Functions

#### `generateBarcode(text, type)`
Generates barcode pattern for the specified type.

```javascript
const result = generateBarcode("123456789012", "ean13");
// Returns: { pattern: "101...", displayText: "123456789012" }
```

#### `drawBarcode(canvas, options)`
Renders barcode to HTML5 canvas element.

```javascript
drawBarcode(canvasElement, {
  pattern: "101010101",
  width: 2,
  height: 100,
  showText: true
});
```

## 🎨 Customization

### Color Schemes
The generator supports custom color schemes for different use cases:

```javascript
// High contrast for industrial use
foregroundColor: "#000000"
backgroundColor: "#FFFFFF"

// Colored branding
foregroundColor: "#1a365d"
backgroundColor: "#e2e8f0"
```

### Size Presets
```javascript
// Small labels
width: 1, height: 60

// Standard retail
width: 2, height: 100

// Large format printing
width: 4, height: 150
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 🏗️ Building for Production

Create optimized build:
```bash
npm run build
```

The build files will be generated in the `build/` directory.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



---

**Made with ❤️ for the developer community**
