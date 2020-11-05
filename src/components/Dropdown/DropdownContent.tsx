import React, { useContext } from 'react'

import { DropdownContext } from './Dropdown'
import { DropdownContentInner } from './DropdownContentInner'
import { Portal } from '../Portal'

export const DropdownContentContext = React.createContext<{
  onClickCloser: () => void
  controllable: boolean
  scrollable: boolean
}>({
  onClickCloser: () => {
    /* noop */
  },
  controllable: false,
  scrollable: true,
})

type Props = {
  controllable?: boolean
  scrollable?: boolean
  className?: string
}

export const DropdownContent: React.FC<Props> = ({
  controllable = false,
  scrollable = true,
  className = '',
  children,
}) => {
  const {
    active,
    contentWrapperId,
    triggerRect,
    triggerElementRef,
    onClickCloser,
    setActive,
  } = useContext(DropdownContext)

  return (
    <Portal
      isShown={active}
      onClickOuter={() => setActive(false)}
      onCloseParent={() => setActive(false)}
      triggerRef={triggerElementRef}
    >
      <DropdownContentContext.Provider value={{ onClickCloser, controllable, scrollable }}>
        <DropdownContentInner
          id={contentWrapperId}
          isActive={active}
          triggerRect={triggerRect}
          scrollable={scrollable}
          className={className}
          controllable={controllable}
        >
          {children}
        </DropdownContentInner>
      </DropdownContentContext.Provider>
    </Portal>
  )
}
