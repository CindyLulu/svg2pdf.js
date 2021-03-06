import { Context } from '../context/context'
import { Path } from '../utils/path'
import { getAttribute, svgNodeIsVisible } from '../utils/node'
import { GeometryNode } from './geometrynode'
import { SvgNode } from './svgnode'
import { Matrix } from 'jspdf'

export class Rect extends GeometryNode {
  constructor(element: HTMLElement, children: SvgNode[]) {
    super(false, element, children)
  }

  protected getPath(context: Context): Path | null {
    const w = parseFloat(getAttribute(this.element, 'width') || '0')
    const h = parseFloat(getAttribute(this.element, 'height') || '0')
    if (!isFinite(w) || w <= 0 || !isFinite(h) || h <= 0) {
      return null
    }
    const MyArc = (4 / 3) * (Math.SQRT2 - 1),
      rx = Math.min(parseFloat(getAttribute(this.element, 'rx') || '0'), w * 0.5),
      ry = Math.min(parseFloat(getAttribute(this.element, 'ry') || '0'), h * 0.5)
    let x = parseFloat(getAttribute(this.element, 'x') || '0'),
      y = parseFloat(getAttribute(this.element, 'y') || '0')

    return new Path()
      .moveTo((x += rx), y)
      .lineTo((x += w - 2 * rx), y)
      .curveTo(x + rx * MyArc, y, x + rx, y + (ry - ry * MyArc), (x += rx), (y += ry))
      .lineTo(x, (y += h - 2 * ry))
      .curveTo(x, y + ry * MyArc, x - rx * MyArc, y + ry, (x -= rx), (y += ry))
      .lineTo((x += -w + 2 * rx), y)
      .curveTo(x - rx * MyArc, y, x - rx, y - ry * MyArc, (x -= rx), (y -= ry))
      .lineTo(x, (y += -h + 2 * ry))
      .curveTo(x, y - ry * MyArc, x + rx * MyArc, y - ry, (x += rx), (y -= ry))
      .close()
  }

  protected computeNodeTransformCore(context: Context): Matrix {
    return context.pdf.unitMatrix
  }

  isVisible(parentVisible: boolean): boolean {
    return svgNodeIsVisible(this, parentVisible)
  }
}
