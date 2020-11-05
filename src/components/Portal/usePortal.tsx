import React, {
  FC,
  ReactNode,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { ClosingObserver, isChildPortal, isEventFromChild } from './portalHelper'

interface ParentContextValue {
  parentSeqs: number[]
  parentClosingObserver: ClosingObserver | null
}

const ParentContext = createContext<ParentContextValue>({
  parentSeqs: [],
  parentClosingObserver: null,
})

let portalSeq = 0

export function usePortal(
  isShown: boolean,
  onClickOuter?: () => void,
  onCloseParent?: () => void,
  triggerRef?: RefObject<HTMLElement>,
) {
  const isFirstRendering = useIsFirstRendering()
  const currentSeq = useMemo(() => ++portalSeq, [])
  const parent = useContext(ParentContext)
  const parentSeqs = parent.parentSeqs.concat(currentSeq)
  const currentClosingObserver = useMemo(() => new ClosingObserver(), [])
  const portalRoot = usePortalRoot(parentSeqs)

  const PortalParentProvider: FC<{ children: ReactNode }> = useCallback(
    ({ children }) => {
      const value: ParentContextValue = {
        parentSeqs,
        parentClosingObserver: currentClosingObserver,
      }
      return <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
    },
    // spread parentSeqs array for deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...parentSeqs],
  )

  useClosingEffect(
    isShown,
    useCallback(() => {
      currentClosingObserver.notify()
    }, [currentClosingObserver]),
  )

  useEffect(() => {
    const { parentClosingObserver } = parent
    if (!parentClosingObserver || !onCloseParent) {
      return
    }
    parentClosingObserver.add(onCloseParent)
    return () => parentClosingObserver.remove(onCloseParent)
  }, [parent, onCloseParent])

  useOuterClick(isShown, currentSeq, triggerRef, onClickOuter)

  return {
    portalRoot,
    PortalParentProvider,
    isFirstRendering,
  }
}

function usePortalRoot(parentSeqs: number[]) {
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

  return portalRoot
}

function useClosingEffect(isShown: boolean, handleClose: () => void) {
  const [isShownPrev, setIsShownPrev] = useState(isShown)
  useEffect(() => {
    setIsShownPrev(isShown)
  }, [isShown])

  useEffect(() => {
    if (isShown || !isShownPrev) {
      return
    }
    // fire when isShown was changed from true to false
    handleClose()
  }, [isShown, isShownPrev, handleClose])
}

function useIsFirstRendering() {
  const [isFirstRendering, setIsFirstRendering] = useState(true)
  useEffect(() => {
    setIsFirstRendering(false)
  }, [])
  return isFirstRendering
}

function useOuterClick(
  isShown: boolean,
  currentSeq: number,
  triggerRef: RefObject<HTMLElement> | undefined,
  handleClickOuter: (() => void) | undefined,
) {
  useEffect(() => {
    if (!isShown || !handleClickOuter) {
      return
    }
    const onClickBody = (e: any) => {
      // ignore events from events within DropdownTrigger and DropdownContent
      if (
        (triggerRef && isEventFromChild(e, triggerRef.current)) ||
        isChildPortal(e.target, currentSeq)
      ) {
        return
      }
      handleClickOuter()
    }
    document.body.addEventListener('click', onClickBody, false)

    return () => {
      document.body.removeEventListener('click', onClickBody, false)
    }
  }, [isShown, currentSeq, triggerRef, handleClickOuter])
}
