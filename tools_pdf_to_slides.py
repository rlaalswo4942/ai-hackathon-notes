"""PDF 수업자료 → 슬라이드 이미지 (img/slides/<단원id>/pNN.jpg, 가로 1400px)
사용: python tools_pdf_to_slides.py <PDF 경로> <단원id>          예) python tools_pdf_to_slides.py 3강.pdf ch03
      python tools_pdf_to_slides.py <이미지 경로> <단원id> --summary  → img/summary/<단원id>.jpg (핵심정리 시트)
그 다음 js/content.js 섹션에 p: [페이지 번호들] 을 적으면 오른쪽에 표시됨
"""
import os, sys
import pymupdf

ROOT = os.path.dirname(os.path.abspath(__file__))
WIDTH = 1400


def pdf_to_slides(pdf, lid):
    out = os.path.join(ROOT, "img", "slides", lid)
    os.makedirs(out, exist_ok=True)
    doc = pymupdf.open(pdf)
    for i, pg in enumerate(doc, 1):
        z = WIDTH / pg.rect.width
        pix = pg.get_pixmap(matrix=pymupdf.Matrix(z, z), alpha=False)
        pix.save(os.path.join(out, f"p{i:02d}.jpg"), jpg_quality=82)
    print(f"{len(doc)}장 → {out}")


def to_summary(img, lid):
    out = os.path.join(ROOT, "img", "summary")
    os.makedirs(out, exist_ok=True)
    pix = pymupdf.Pixmap(img)
    if pix.alpha:
        pix = pymupdf.Pixmap(pix, 0)
    dst = os.path.join(out, lid + ".jpg")
    pix.save(dst, jpg_quality=85)
    print("→", dst, f'(content.js 단원에 summary: "img/summary/{lid}.jpg" 추가)')


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    src, lid = sys.argv[1], sys.argv[2]
    if "--summary" in sys.argv or not src.lower().endswith(".pdf"):
        to_summary(src, lid)
    else:
        pdf_to_slides(src, lid)
