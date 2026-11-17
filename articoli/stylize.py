#!/usr/bin/env python3
"""
ilBosco — stile "grana" per le immagini degli articoli

Trasforma qualsiasi immagine (generata o fotografica) nello stile della rassegna:
bianco e nero, contrasto deciso, grana a puntini, ritaglio 3:2.

  python3 articoli/stylize.py <input> <id>          → articoli/images/<id>.webp
  python3 articoli/stylize.py <input> <id> --grain 0.5   → più grana

Poi: node articoli/generate.js --write
Richiede Pillow e numpy (pip install pillow numpy).
"""
import argparse
import os
import sys

import numpy as np
from PIL import Image, ImageFilter, ImageOps

OUT_W, OUT_H = 1200, 800  # 3:2, come il ritaglio delle card
HERE = os.path.dirname(os.path.abspath(__file__))


def stylize(img: Image.Image, grain: float, seed: int) -> Image.Image:
    # Ritaglio centrato 3:2 e ridimensionamento
    img = ImageOps.fit(img.convert("RGB"), (OUT_W, OUT_H), Image.LANCZOS, centering=(0.5, 0.5))

    # Bianco e nero con contrasto deciso (taglia l'1% di ombre e luci)
    gray = ImageOps.autocontrast(ImageOps.grayscale(img), cutoff=1)
    g = np.asarray(gray, dtype=np.float32) / 255.0

    # Grana a puntini: retinatura stocastica (soglia contro rumore casuale),
    # mescolata con i grigi originali così i dettagli restano leggibili.
    rng = np.random.default_rng(seed)
    noise = rng.random(g.shape, dtype=np.float32)
    dots = (g > noise).astype(np.float32)
    out = grain * dots + (1.0 - grain) * g

    result = Image.fromarray((out * 255).clip(0, 255).astype(np.uint8), mode="L")
    # Ammorbidisce appena i puntini, come una stampa
    return result.filter(ImageFilter.GaussianBlur(0.45))


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("input", help="immagine sorgente")
    p.add_argument("id", help="id dell'articolo in articoli.json (diventa il nome del file)")
    p.add_argument("--grain", type=float, default=0.35, help="intensità della grana, 0–1 (default 0.35)")
    p.add_argument("--seed", type=int, default=7, help="seme del rumore, per risultati ripetibili")
    p.add_argument("--out-dir", default=os.path.join(HERE, "images"))
    a = p.parse_args()

    if not 0 <= a.grain <= 1:
        sys.exit("--grain deve essere tra 0 e 1")

    out_path = os.path.join(a.out_dir, f"{a.id}.webp")
    stylize(Image.open(a.input), a.grain, a.seed).save(out_path, "WEBP", quality=82, method=6)
    print(f"✓ {os.path.relpath(out_path)}")


if __name__ == "__main__":
    main()
