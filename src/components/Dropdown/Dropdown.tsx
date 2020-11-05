import React, {
  FC,
  MutableRefObject,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'

import { Rect, getFirstTabbable } from './dropdownHelper'
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
  contentWrapperId: string
  contentWrapperRef: MutableRefObject<HTMLDivElement | null>
  setActive: (active: boolean) => void
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
  contentWrapperId: '',
  contentWrapperRef: React.createRef(),
  setActive: () => {
    /* noop */
  },
})

export const Dropdown: FC<Props> = ({ children }) => {
  const [active, setActive] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect>(initialRect)

  const { rootTriggerRef } = useContext(DropdownContext)

  const triggerElementRef = useRef<HTMLDivElement>(null)
  const contentWrapperId = useId()
  const contentWrapperRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setActive(false)
    // wait to re-render
    requestAnimationFrame(() => {
      // return focus to the Trigger
      const trigger = getFirstTabbable(triggerElementRef)
      if (trigger) {
        trigger.focus()
      }
    })
  }, [])

  return (
    <DropdownContext.Provider
      value={{
        active,
        triggerRect,
        triggerElementRef,
        rootTriggerRef: rootTriggerRef || triggerElementRef || null,
        onClickTrigger: (rect) => {
          const newActive = !active
          setActive(newActive)
          if (newActive) {
            setTriggerRect(rect)
            requestAnimationFrame(() => {
              // wait and focus element in content
              const firstTabbale = getFirstTabbable(contentWrapperRef)
              if (firstTabbale) {
                firstTabbale.focus()
              }
            })
          }
        },
        onClickCloser: close,
        contentWrapperId,
        contentWrapperRef,
        setActive,
      }}
    >
      {children}
    </DropdownContext.Provider>
  )
}
