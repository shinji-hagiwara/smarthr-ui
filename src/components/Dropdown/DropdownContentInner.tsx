import React, { FC, createContext, useContext, useLayoutEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { DropdownContext } from './Dropdown'
import { ContentBoxStyle, getContentBoxStyle, getFirstTabbable } from './dropdownHelper'
import { DropdownCloser } from './DropdownCloser'
import { useKeyboardNavigation } from './useKeyboardNavigation'

type Props = {
  scrollable: boolean
  children: React.ReactNode
  className: string
  controllable: boolean
}

type DropdownContentInnerContextType = {
  maxHeight: string
}

export const DropdownContentInnerContext = createContext<DropdownContentInnerContextType>({
  maxHeight: '',
})

export const DropdownContentInner: FC<Props> = ({
  scrollable,
  children,
  className,
  controllable,
}) => {
  const theme = useTheme()
  const { active, contentWrapperId, triggerRect } = useContext(DropdownContext)
  const [contentBox, setContentBox] = useState<ContentBoxStyle>({
    top: '0',
    left: '0',
    maxHeight: '',
  })
  const wrapperRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (wrapperRef.current) {
      setContentBox(
        getContentBoxStyle(
          triggerRect,
          {
            width: wrapperRef.current.offsetWidth,
            height: wrapperRef.current.offsetHeight,
          },
          {
            width: innerWidth,
            height: innerHeight,
          },
          {
            top: pageYOffset,
            left: pageXOffset,
          },
        ),
      )
    }
  }, [triggerRect])

  useLayoutEffect(() => {
    if (active) {
      const firstTabbale = getFirstTabbable(wrapperRef)
      if (firstTabbale) {
        firstTabbale.focus()
      }
    }
  }, [active])

  useKeyboardNavigation(wrapperRef)

  return (
    <Wrapper
      id={contentWrapperId}
      ref={wrapperRef}
      contentBox={contentBox}
      scrollable={scrollable}
      className={`${className} ${active ? 'active' : ''}`}
      controllable={controllable}
      themes={theme}
    >
      {controllable ? (
        children
      ) : (
        <DropdownContentInnerContext.Provider value={{ maxHeight: contentBox.maxHeight }}>
          <DropdownCloser>{children}</DropdownCloser>
        </DropdownContentInnerContext.Provider>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  themes: Theme
  contentBox: ContentBoxStyle
  scrollable: boolean
  controllable: boolean
}>`
  ${({ contentBox, themes, scrollable, controllable }) => {
    const { frame, zIndex } = themes

    return css`
      z-index: ${zIndex.OVERLAP};
      position: absolute;
      top: ${contentBox.top};
      left: ${contentBox.left};
      border-radius: ${frame.border.radius.m};
      box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);
      background-color: #fff;
      white-space: nowrap;

      ${controllable
        ? `
          display: flex;
          flex-direction: column;
          `
        : ''}

      ${contentBox.maxHeight && scrollable && controllable
        ? `
          max-height: ${contentBox.maxHeight};
          `
        : ''}

      &:not(.active) {
        display: none;
      }
    `
  }}
`
