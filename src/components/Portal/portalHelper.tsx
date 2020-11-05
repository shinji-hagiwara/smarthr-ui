export function isChildPortal(element: HTMLElement | null, parentPortalSeq: number): boolean {
  if (!element) return false
  const childOf = element.dataset.portalChildOf || ''
  const includesSeq = childOf.split(',').includes(String(parentPortalSeq))
  return includesSeq || isChildPortal(element.parentElement, parentPortalSeq)
}

export function isEventFromChild(e: Event, parent: Element | null): boolean {
  const path = e.composedPath && e.composedPath()
  if (!path) {
    // fallback for IE
    if (e.target instanceof Element) {
      return isChildElement(e.target, parent)
    }
    return false
  }
  if (path.length === 0 || !parent) return false
  return path.includes(parent)
}

function isChildElement(target: Element | null, parent: Element | null): boolean {
  if (!target || !parent) return false
  return target === parent || isChildElement(target.parentElement, parent)
}

export class ClosingObserver {
  private callbacks: Array<() => void> = []
  add(callback: () => void) {
    this.callbacks.push(callback)
  }
  remove(callback: () => void) {
    this.callbacks = this.callbacks.filter((_callback) => _callback !== callback)
  }
  notify() {
    this.callbacks.forEach((callback) => callback())
  }
}
