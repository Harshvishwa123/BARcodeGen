import React, { useState, useRef, useEffect } from 'react';
import { Download, Settings, RotateCcw, Copy, Check } from 'lucide-react';

const BarcodeGenerator = () => {
  const [text, setText] = useState('123456789012');
  const [barcodeType, setBarcodeType] = useState('code128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [fontSize, setFontSize] = useState(14);
  const [showText, setShowText] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [margin, setMargin] = useState(10);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);
  const [error, setError] = useState('');

  // Code 128 patterns
  const code128Patterns = {
    '0': '11011001100', '1': '11001101100', '2': '11001100110', '3': '10010011000',
    '4': '10010001100', '5': '10001001100', '6': '10011001000', '7': '10011000100',
    '8': '10001100100', '9': '11001001000', 'A': '11001000100', 'B': '11000100100',
    'C': '10110011100', 'D': '10011011100', 'E': '10011001110', 'F': '10111001000',
    'G': '10011101000', 'H': '10011100100', 'I': '11001110010', 'J': '11001011100',
    'K': '11001001110', 'L': '11011100100', 'M': '11001110100', 'N': '11101101110',
    'O': '11101001100', 'P': '11100101100', 'Q': '11100100110', 'R': '11101100100',
    'S': '11100110100', 'T': '11100110010', 'U': '11011011000', 'V': '11011000110',
    'W': '11000110110', 'X': '10100011000', 'Y': '10001011000', 'Z': '10001000110',
    ' ': '10110001000', '!': '10001101000', '"': '10001100010', '#': '11010001000',
    '$': '11000101000', '%': '11000100010', '&': '10110111000', "'": '10110001110',
    '(': '10001101110', ')': '10111011000', '*': '10111000110', '+': '10001110110',
    ',': '11101110110', '-': '11010001110', '.': '11000101110', '/': '11011101000',
    ':': '11011100010', ';': '11011101110', '<': '11101011000', '=': '11101000110',
    '>': '11100010110', '?': '11101101000', '@': '11101100010', '[': '11100011010',
    '\\': '11101111010', ']': '11001000010', '^': '11110001010', '_': '10100110000',
    '`': '10100001100', 'a': '10010110000', 'b': '10010000110', 'c': '10000101100',
    'd': '10000100110', 'e': '10110010000', 'f': '10110000100', 'g': '10011010000',
    'h': '10011000010', 'i': '10000110100', 'j': '10000110010', 'k': '11000010010',
    'l': '11001010000', 'm': '11110111010', 'n': '11000010100', 'o': '10001111010',
    'p': '10100111100', 'q': '10010111100', 'r': '10010011110', 's': '10111100100',
    't': '10011110100', 'u': '10011110010', 'v': '11110100100', 'w': '11110010100',
    'x': '11110010010', 'y': '11011011110', 'z': '11011110110', '{': '11110110110',
    '|': '10101111000', '}': '10100011110', '~': '10001011110'
  };

  const startPattern = '11010010000';
  const stopPattern = '1100011101011';

  // EAN-13 patterns
  const ean13LeftOdd = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
  const ean13LeftEven = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
  const ean13Right = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
  const ean13Patterns = [
    'LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'
  ];

  // UPC-A is similar to EAN-13 but with implicit country code
  const generateCode128 = (data) => {
    let pattern = startPattern;
    let checksum = 104; // Start B
    
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      if (code128Patterns[char]) {
        pattern += code128Patterns[char];
        checksum += (char.charCodeAt(0) - 32) * (i + 1);
      }
    }
    
    checksum = checksum % 103;
    const checksumChar = String.fromCharCode(checksum + 32);
    if (code128Patterns[checksumChar]) {
      pattern += code128Patterns[checksumChar];
    }
    
    pattern += stopPattern;
    return pattern;
  };

  const generateEAN13 = (data) => {
    if (data.length !== 12 && data.length !== 13) {
      throw new Error('EAN-13 requires 12 or 13 digits');
    }
    
    // Calculate check digit if not provided
    let digits = data.padEnd(12, '0').substring(0, 12);
    if (data.length === 13) {
      digits = data.substring(0, 12);
    }
    
    let checksum = 0;
    for (let i = 0; i < 12; i++) {
      checksum += parseInt(digits[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (checksum % 10)) % 10;
    digits += checkDigit;
    
    const firstDigit = parseInt(digits[0]);
    const pattern = ean13Patterns[firstDigit];
    
    let barcode = '101'; // Start guard
    
    // Left side
    for (let i = 1; i <= 6; i++) {
      const digit = parseInt(digits[i]);
      if (pattern[i-1] === 'L') {
        barcode += ean13LeftOdd[digit];
      } else {
        barcode += ean13LeftEven[digit];
      }
    }
    
    barcode += '01010'; // Center guard
    
    // Right side
    for (let i = 7; i <= 12; i++) {
      const digit = parseInt(digits[i]);
      barcode += ean13Right[digit];
    }
    
    barcode += '101'; // End guard
    
    return { pattern: barcode, displayText: digits };
  };

  const generateUPCA = (data) => {
    if (data.length !== 11 && data.length !== 12) {
      throw new Error('UPC-A requires 11 or 12 digits');
    }
    
    // UPC-A is essentially EAN-13 with country code 0
    const upcData = '0' + data.padEnd(11, '0').substring(0, 11);
    return generateEAN13(upcData);
  };

  const generateCode39 = (data) => {
    const patterns = {
      '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
      '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
      '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
      'C': '110110100101', 'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
      'G': '101010011011', 'H': '110101001101', 'I': '101101001101', 'J': '101011001101',
      'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
      'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
      'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
      'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
      '-': '100101011011', '.': '110010101101', ' ': '100110101101', '*': '100101101101'
    };
    
    let pattern = patterns['*']; // Start
    for (const char of data.toUpperCase()) {
      if (patterns[char]) {
        pattern += patterns[char];
      }
    }
    pattern += patterns['*']; // Stop
    
    return pattern;
  };

  const generateBarcode = () => {
    try {
      setError('');
      let pattern = '';
      let displayText = text;
      
      switch (barcodeType) {
        case 'code128':
          pattern = generateCode128(text);
          break;
        case 'ean13':
          const ean13Result = generateEAN13(text);
          pattern = ean13Result.pattern;
          displayText = ean13Result.displayText;
          break;
        case 'upca':
          const upcaResult = generateUPCA(text);
          pattern = upcaResult.pattern;
          displayText = upcaResult.displayText;
          break;
        case 'code39':
          pattern = generateCode39(text);
          break;
        default:
          pattern = generateCode128(text);
      }
      
      return { pattern, displayText };
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const drawBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const result = generateBarcode();
    
    if (!result) return;
    
    const { pattern, displayText } = result;
    const textHeight = showText ? fontSize + 10 : 0;
    const barcodeWidth = pattern.length * width;
    
    canvas.width = barcodeWidth + (margin * 2);
    canvas.height = height + textHeight + (margin * 2);
    
    // Clear canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw bars
    ctx.fillStyle = foregroundColor;
    let x = margin;
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === '1') {
        ctx.fillRect(x, margin, width, height);
      }
      x += width;
    }
    
    // Draw text
    if (showText) {
      ctx.fillStyle = foregroundColor;
      ctx.font = `${fontSize}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(displayText, canvas.width / 2, margin + height + 5);
    }
  };

  const downloadBarcode = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `barcode_${text}_${barcodeType}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    });
  };

  const resetSettings = () => {
    setText('123456789012');
    setBarcodeType('code128');
    setWidth(2);
    setHeight(100);
    setFontSize(14);
    setShowText(true);
    setBackgroundColor('#ffffff');
    setForegroundColor('#000000');
    setMargin(10);
  };

  useEffect(() => {
    drawBarcode();
  }, [text, barcodeType, width, height, fontSize, showText, backgroundColor, foregroundColor, margin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Professional Barcode Generator</h1>
          <p className="text-slate-300">Generate industry-standard barcodes with professional quality</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Configuration</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Data to Encode</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter text or numbers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Barcode Type</label>
                  <select
                    value={barcodeType}
                    onChange={(e) => setBarcodeType(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="code128">Code 128</option>
                    <option value="ean13">EAN-13</option>
                    <option value="upca">UPC-A</option>
                    <option value="code39">Code 39</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Bar Width</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={width}
                      onChange={(e) => setWidth(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-slate-400">{width}px</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Height</label>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-slate-400">{height}px</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Font Size</label>
                    <input
                      type="range"
                      min="8"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-slate-400">{fontSize}px</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Margin</label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={margin}
                      onChange={(e) => setMargin(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-slate-400">{margin}px</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Background</label>
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-full h-10 rounded-lg border border-white/10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Foreground</label>
                    <input
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="w-full h-10 rounded-lg border border-white/10"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showText"
                    checked={showText}
                    onChange={(e) => setShowText(e.target.checked)}
                    className="rounded border-white/10"
                  />
                  <label htmlFor="showText" className="text-sm text-slate-300">Show text below barcode</label>
                </div>

                <button
                  onClick={resetSettings}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>

          {/* Barcode Display */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Generated Barcode</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadBarcode}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
                  {error}
                </div>
              )}

              <div className="bg-white rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto shadow-lg"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Barcode Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Format:</span>
                    <span className="text-white ml-2">{barcodeType.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Data:</span>
                    <span className="text-white ml-2">{text}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Dimensions:</span>
                    <span className="text-white ml-2">{canvasRef.current?.width || 0} × {canvasRef.current?.height || 0}px</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Quality:</span>
                    <span className="text-white ml-2">Print Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;