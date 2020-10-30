import React, {
  FC,
  MutableRefObject,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { Rect, getFirstTabbable, isEventFromChild } from './dropdownHelper'
import { usePortal } from '../../hooks/usePortal'
import { useId } from '../../hooks/useId'

type Props = {
  children: ReactNode
}

type DropdownContextType = {
  active: boolean
  triggerRect: Rect
  triggerElementRef: MutableRefObject<HTMLDivElement | null>
  rootTriggerRef: MutableRefObject<HTMLDivElement | null> | null
  onClickTrigger: (rect: Rect) => void
  onClickCloser: () => void
  DropdownContentRoot: FC<{ children: ReactNode }>
  contentWrapperId: string
}

const initialRect = { top: 0, right: 0, bottom: 0, left: 0 }

export const DropdownContext = createContext<DropdownContextType>({
  active: false,
  triggerRect: initialRect,
  triggerElementRef: React.createRef(),
  rootTriggerRef: null,
  onClickTrigger: () => {
    /* noop */
  },
  onClickCloser: () => {
    /* noop */
  },
  DropdownContentRoot: () => null,
  contentWrapperId: '',
})

export const Dropdown: FC<Props> = ({ children }) => {
  const [active, setActive] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect>(initialRect)

  const { rootTriggerRef } = useContext(DropdownContext)
  const {
    portalRoot,
    isChildPortal,
    PortalParentProvider,
    notifyClose,
    parentClosingSubject,
  } = usePortal()

  const triggerElementRef = useRef<HTMLDivElement>(null)
  const contentWrapperId = useId()

  const close = useCallback(() => {
    notifyClose()
    setActive(false)
    // wait to re-render
    requestAnimationFrame(() => {
      // return focus to the Trigger
      const trigger = getFirstTabbable(triggerElementRef)
      if (trigger) {
        trigger.focus()
      }
    })
  }, [notifyClose])

  useEffect(() => {
    if (!parentClosingSubject) {
      return
    }
    parentClosingSubject.add(close)
    return () => parentClosingSubject.remove(close)
  }, [parentClosingSubject, close])

  useEffect(() => {
    const onClickBody = (e: any) => {
      // ignore events from events within DropdownTrigger and DropdownContent
      if (isEventFromChild(e, triggerElementRef.current) || isChildPortal(e.target)) {
        return
      }
      setActive(false)
    }
    document.body.addEventListener('click', onClickBody, false)

    return () => {
      document.body.removeEventListener('click', onClickBody, false)
    }
  }, [isChildPortal, portalRoot])

  // This is the root container of a dropdown content located in outside the DOM tree
  const DropdownContentRoot = useMemo<FC<{ children: ReactNode }>>(
    () => (props) => {
      return createPortal(props.children, portalRoot)
    },
    [portalRoot],
  )
  // set the displayName explicit for DevTools
  DropdownContentRoot.displayName = 'DropdownContentRoot'

  return (
    <PortalParentProvider>
      <DropdownContext.Provider
        value={{
          active,
          triggerRect,
          triggerElementRef,
          rootTriggerRef: rootTriggerRef || triggerElementRef || null,
          onClickTrigger: (rect) => {
            const newActive = !active
            setActive(newActive)
            if (newActive) setTriggerRect(rect)
          },
          onClickCloser: close,
          DropdownContentRoot,
          contentWrapperId,
        }}
      >
        {children}
      </DropdownContext.Provider>
    </PortalParentProvider>
  )
}
