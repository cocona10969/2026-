Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class HeroCutout {
  static int W, H, Stride;
  static byte[] Src;
  static bool[] Bg;
  static double AvgR, AvgG, AvgB;

  public static void Run(string inputPath, string outputPath) {
    using (var loaded = new Bitmap(inputPath))
    using (var srcBmp = new Bitmap(loaded.Width, loaded.Height, PixelFormat.Format32bppArgb)) {
      using (var g = Graphics.FromImage(srcBmp)) g.DrawImage(loaded, 0, 0, loaded.Width, loaded.Height);
      W = srcBmp.Width;
      H = srcBmp.Height;
      var rect = new Rectangle(0, 0, W, H);
      var data = srcBmp.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
      Stride = data.Stride;
      Src = new byte[Math.Abs(Stride) * H];
      Marshal.Copy(data.Scan0, Src, 0, Src.Length);
      srcBmp.UnlockBits(data);
    }

    SampleBorder();
    FloodFillBackground();
    byte[] output = BuildOutput();

    using (var outBmp = new Bitmap(W, H, PixelFormat.Format32bppArgb)) {
      var rect = new Rectangle(0, 0, W, H);
      var outData = outBmp.LockBits(rect, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
      Marshal.Copy(output, 0, outData.Scan0, output.Length);
      outBmp.UnlockBits(outData);
      outBmp.Save(outputPath, ImageFormat.Png);
    }
  }

  static void SampleBorder() {
    int step = Math.Max(1, Math.Min(W, H) / 90);
    double r = 0, g = 0, b = 0;
    int count = 0;
    Action<int,int> add = (x, y) => {
      int i = Idx(x, y);
      b += Src[i];
      g += Src[i + 1];
      r += Src[i + 2];
      count++;
    };
    for (int x = 0; x < W; x += step) {
      add(x, 0);
      add(x, H - 1);
    }
    for (int y = 0; y < H; y += step) {
      add(0, y);
      add(W - 1, y);
    }
    AvgR = r / count;
    AvgG = g / count;
    AvgB = b / count;
  }

  static bool IsBackgroundLike(int x, int y) {
    int i = Idx(x, y);
    int b = Src[i], g = Src[i + 1], r = Src[i + 2];
    double dr = Math.Abs(r - AvgR);
    double dg = Math.Abs(g - AvgG);
    double db = Math.Abs(b - AvgB);
    double dist = Math.Sqrt(dr * dr + dg * dg + db * db);
    int max = Math.Max(r, Math.Max(g, b));
    int min = Math.Min(r, Math.Min(g, b));
    bool purpleFamily = (b >= g - 2) && (r >= g - 8) && (max < 104) && ((max - min) < 54);
    bool veryDarkPurple = (max < 40) && (b >= g) && (r >= g - 7);
    return (dist < 45) || (purpleFamily && dist < 82) || veryDarkPurple;
  }

  static void FloodFillBackground() {
    Bg = new bool[W * H];
    var q = new Queue<int>();
    Action<int,int> tryAdd = (x, y) => {
      if (x < 0 || x >= W || y < 0 || y >= H) return;
      int n = y * W + x;
      if (Bg[n]) return;
      if (!IsBackgroundLike(x, y)) return;
      Bg[n] = true;
      q.Enqueue(n);
    };
    for (int x = 0; x < W; x++) {
      tryAdd(x, 0);
      tryAdd(x, H - 1);
    }
    for (int y = 0; y < H; y++) {
      tryAdd(0, y);
      tryAdd(W - 1, y);
    }
    while (q.Count > 0) {
      int n = q.Dequeue();
      int x = n % W;
      int y = n / W;
      tryAdd(x + 1, y);
      tryAdd(x - 1, y);
      tryAdd(x, y + 1);
      tryAdd(x, y - 1);
    }
  }

  static byte[] BuildOutput() {
    var output = new byte[Src.Length];
    Array.Copy(Src, output, Src.Length);
    for (int y = 0; y < H; y++) {
      for (int x = 0; x < W; x++) {
        int bgIndex = y * W + x;
        int i = Idx(x, y);
        if (Bg[bgIndex]) {
          output[i + 3] = 0;
          continue;
        }

        int near = 0;
        for (int oy = -2; oy <= 2; oy++) {
          for (int ox = -2; ox <= 2; ox++) {
            int nx = x + ox, ny = y + oy;
            if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
            if (Bg[ny * W + nx]) near++;
          }
        }

        byte alpha = 255;
        if (near > 12) alpha = 208;
        else if (near > 4) alpha = 236;
        output[i + 3] = alpha;

        if (near > 0 && IsBackgroundLike(x, y)) {
          output[i] = (byte)Math.Max(0, Math.Min(255, output[i] * 0.86));
          output[i + 1] = (byte)Math.Max(0, Math.Min(255, output[i + 1] * 1.04 + 3));
          output[i + 2] = (byte)Math.Max(0, Math.Min(255, output[i + 2] * 1.06 + 4));
          output[i + 3] = Math.Min(output[i + 3], (byte)220);
        }
      }
    }
    return output;
  }

  static int Idx(int x, int y) {
    return y * Stride + x * 4;
  }
}
"@

$inputPath = (Resolve-Path "public\hero-qgirl-laying.png").Path
$outputPath = Join-Path (Resolve-Path "public").Path "hero-qgirl-laying-cutout.png"
[HeroCutout]::Run($inputPath, $outputPath)
Write-Output $outputPath
