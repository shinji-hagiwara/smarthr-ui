import React, { useContext } from 'react'
import { createPortal } from 'react-dom'

import { DropdownContext } from './Dropdown'
import { DropdownContentInner } from './DropdownContentInner'

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
  const { portalRoot, active, contentWrapperId, triggerRect, onClickCloser } = useContext(
    DropdownContext,
  )

  if (!portalRoot) {
    return null
  }

  return createPortal(
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
    </DropdownContentContext.Provider>,
    portalRoot,
  )
}
