import React, {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'

interface ParentContextValue {
  seqs: number[]
  closingSubject: ClosingSubject | null
}

const ParentContext = createContext<ParentContextValue>({
  seqs: [],
  closingSubject: null,
})

let portalSeq = 0

export function usePortal() {
  const currentSeq = useMemo(() => ++portalSeq, [])
  const parent = useContext(ParentContext)
  const parentSeqs = parent.seqs.concat(currentSeq)

  const currentClosingSubject = useMemo(() => new ClosingSubject(), [])

  const portalRoot = useMemo(() => {
    const element = document.createElement('div')
    element.dataset.portalChildOf = parentSeqs.join(',')
    return element
    // spread parentSeqs array for deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...parentSeqs])

  useEffect(() => {
    document.body.appendChild(portalRoot)
    return () => {
      document.body.removeChild(portalRoot)
    }
    // spread parentSeqs array for deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...parentSeqs, portalRoot])

  const isChildPortal = useCallback(
    (element: HTMLElement | null) => {
      return _isChildPortal(element, currentSeq)
    },
    [currentSeq],
  )

  const PortalParentProvider: FC<{ children: ReactNode }> = useCallback(
    ({ children }) => {
      const value: ParentContextValue = {
        seqs: parentSeqs,
        closingSubject: currentClosingSubject,
      }
      return <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
    },
    // spread parentSeqs array for deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...parentSeqs],
  )

  return {
    portalRoot,
    isChildPortal,
    PortalParentProvider,
    notifyClose: useCallback(() => currentClosingSubject.notify(), [currentClosingSubject]),
    parentClosingSubject: parent.closingSubject,
  }
}

function _isChildPortal(element: HTMLElement | null, parentPortalSeq: number): boolean {
  if (!element) return false
  const childOf = element.dataset.portalChildOf || ''
  const includesSeq = childOf.split(',').includes(String(parentPortalSeq))
  return includesSeq || _isChildPortal(element.parentElement, parentPortalSeq)
}

type ClosingObserver = () => void
class ClosingSubject {
  private observers: ClosingObserver[] = []
  add(observer: ClosingObserver) {
    this.observers.push(observer)
  }
  remove(observer: ClosingObserver) {
    this.observers = this.observers.filter((_observer) => _observer !== observer)
  }
  notify() {
    this.observers.forEach((observer) => observer())
  }
}
