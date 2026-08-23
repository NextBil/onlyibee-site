import AppKit

// composite <blank.png> <print.svg> <out.jpg>
//
// The print goes into the chest box measured off the pieces in "keep those".
// Blending is done per pixel rather than with CG blend modes: the ink is laid
// over the blank by its own alpha, and inside the ink the blank's luminance is
// mixed back so the print picks up the shirt's folds. Doing this with
// clip(to:mask:) instead reads the RGB as a luminance mask and eats the fill.
let a = CommandLine.arguments
guard a.count >= 4,
      let blank = NSImage(contentsOfFile: a[1]),
      let art   = NSImage(contentsOfFile: a[2]) else { print("load fail"); exit(1) }

let S = 2048, BW = 660.0, CY = 915.0
let FOLD = 0.34   // how much of the fabric's shading shows through the ink

func rasterize(_ draw: () -> Void) -> (px: UnsafeMutablePointer<UInt8>, rb: Int, ctx: CGContext) {
  let c = CGContext(data: nil, width: S, height: S, bitsPerComponent: 8, bytesPerRow: 0,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  let g = NSGraphicsContext(cgContext: c, flipped: false)
  NSGraphicsContext.saveGraphicsState(); NSGraphicsContext.current = g
  draw()
  NSGraphicsContext.restoreGraphicsState()
  return (c.data!.bindMemory(to: UInt8.self, capacity: c.bytesPerRow*S), c.bytesPerRow, c)
}

let full = NSRect(x: 0, y: 0, width: S, height: S)
// Fit the art inside the chest box preserving its aspect — the folder's own
// prints are not all square (the ONLYIBEE wordmark is 3.7:1) and stretching
// them to the box would distort the letterforms.
let ar = art.size.width / max(1, art.size.height)
let bw = ar >= 1 ? BW : BW*ar
let bh = ar >= 1 ? BW/ar : BW
let box  = NSRect(x: 1024.0-bw/2, y: Double(S)-CY-bh/2, width: bw, height: bh)

let B = rasterize { blank.draw(in: full, from: .zero, operation: .copy, fraction: 1.0) }
let A = rasterize { art.draw(in: box, from: .zero, operation: .sourceOver, fraction: 1.0) }

for y in 0..<S {
  let br = y*B.rb, ar = y*A.rb
  for x in 0..<S {
    let ai = ar + x*4
    let alpha = Double(A.px[ai+3]) / 255.0
    if alpha < 0.004 { continue }
    let bi = br + x*4
    // un-premultiply the ink
    let ir = Double(A.px[ai])/255.0/alpha, ig = Double(A.px[ai+1])/255.0/alpha, ib = Double(A.px[ai+2])/255.0/alpha
    let sr = Double(B.px[bi])/255.0, sg = Double(B.px[bi+1])/255.0, sb = Double(B.px[bi+2])/255.0
    // the shirt's own light, normalised so flat cloth leaves the ink alone and
    // only the folds and the drop shadow darken it
    let lum = min(1.6, (0.299*sr + 0.587*sg + 0.114*sb) / 0.62)
    let shade = 1.0 - FOLD + FOLD*lum
    func mix(_ ink: Double, _ shirt: Double) -> UInt8 {
      let v = ink*shade*alpha + shirt*(1.0-alpha)
      return UInt8(max(0, min(255, (v*255).rounded())))
    }
    B.px[bi] = mix(ir, sr); B.px[bi+1] = mix(ig, sg); B.px[bi+2] = mix(ib, sb)
  }
}

let rep = NSBitmapImageRep(cgImage: B.ctx.makeImage()!)
let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.86])!
try! data.write(to: URL(fileURLWithPath: a[3]))
print("ok", (a[3] as NSString).lastPathComponent, data.count/1024, "KB")
