import React, { FC, RefObject } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import { usePortal } from './usePortal'

type Props = {
  isShown: boolean
  onClickOuter?: () => void
  onCloseParent?: () => void
  triggerRef?: RefObject<HTMLElement>
}

export const Portal: FC<Props> = ({
  isShown,
  onClickOuter,
  onCloseParent,
  triggerRef,
  children,
}) => {
  const { portalRoot, PortalParentProvider, isFirstRendering } = usePortal(
    isShown,
    onClickOuter,
    onCloseParent,
    triggerRef,
  )

  if (isFirstRendering) {
    // do not render at the first time to put the child portal element behind the parent portal element
    return null
  }

  return createPortal(
    <PortalParentProvider>
      <Wrapper className={isShown ? undefined : 'hidden'}>{children}</Wrapper>
    </PortalParentProvider>,
    portalRoot,
  )
}

const Wrapper = styled.div`
  &.hidden {
    display: none;
  }
`
