import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import TabTrap from './tabtrap'

export default function Modal (modal, options) {
  if (!modal || !modal.id) {
    return
  }

  if (!options) {
    options = {}
  }

  if (typeof options.changeHash === 'undefined') {
    options.changeHash = true
  }

  let triggers = []
  let activeTrigger
  let hash
  let nextSibling
  let parent
  let parentModal

  /**
   * A Gent styleguide class to create a tabTrap.
   * @type {TabTrap}
   */
  const tabTrap = new TabTrap(modal)

  /**
   * Initialise the component.
   */
  const init = () => {
    triggers = document.querySelectorAll(`[aria-controls="${modal.id}"], [href="#${modal.id}"]`)
    nextSibling = modal.nextElementSibling
    parent = modal.parentElement

    if (!options.changeHash && triggers.length === 0) {
      return
    }

    modal.setAttribute('tabindex', '-1')
    modal.setAttribute('aria-hidden', 'true')
    modal.setAttribute('data-gent-modal', 'true')

    const _open = (e) => {
      activeTrigger = e.currentTarget

      if (activeTrigger.hasAttribute('aria-controls')) {
        open()
      }
    }

    for (let i = triggers.length; i--;) {
      triggers[i].setAttribute('aria-expanded', 'false')
      triggers[i].addEventListener('click', _open)
    }

    /**
     * A list of elements to trigger closing the modal.
     * At least one must have the button role.
     * @type {NodeList}
     */
    const closeBtns = modal.querySelectorAll(
      options.closeBtns || '.modal-close'
    )
    for (let i = closeBtns.length; i--;) {
      if (!closeBtns[i].dataset.target || closeBtns[i].dataset.target === modal.id) {
        closeBtns[i].addEventListener('click', handleClose)
      }
    }

    /*
     * Possibility to alter the URL fragment when the modal opens/closes.
     */
    hash = window.location.hash
    if (options.changeHash) {
      addHashEvents()
    }

    /*
     * Custom event triggered on resize and on init.
     * For instance for when the modal is not hidden on all screen sizes.
     */
    if (options.resizeEvent) {
      options.resizeEvent(open, close)
      addResizeEvent()
    }
  }

  /**
   * A little helper to get siblings of an element.
   * @return {...NodeListOf<ChildNode>[]}
   */
  const getSiblings = () => {
    return [...modal.parentNode.childNodes].filter(n => n.nodeType === 1 && n !== modal)
  }

  /**
   * Open the modal.
   *
   * @param {Boolean} changeHash  Whether or not to change the hash in the URI
   */
  const open = (changeHash = true) => {
    if (changeHash && options.changeHash !== false) { // change the url
      history.pushState(null, null, `#${modal.id}`)
      hash = `#${modal.id}`
    }

    parentModal = document.querySelector('body > [data-gent-modal]')
    if (parentModal) {
      document.body.replaceChild(modal, parentModal)
    } else {
      document.body.appendChild(modal)
    }

    modal.classList.add('visible')
    modal.setAttribute('aria-hidden', 'false')

    const scrollable = modal.dataset.scrollable
    disableBodyScroll(scrollable ? modal.querySelector(scrollable) : modal)

    const siblings = getSiblings()
    siblings.forEach(n => n.setAttribute('aria-hidden', true))

    document.addEventListener('keydown', handleKeyboardInput)
    if (activeTrigger) {
      activeTrigger.setAttribute('aria-expanded', 'true')
    }
    modal.focus()
  }

  /**
   * Close the modal.
   */
  const close = () => {
    const siblings = getSiblings()
    siblings.forEach(n => n.setAttribute('aria-hidden', false))

    modal.classList.remove('visible')
    modal.setAttribute('aria-hidden', 'true')

    if (parentModal) {
      modal.parentNode.replaceChild(parentModal, modal)
      enableBodyScroll(modal)
      const scrollable = parentModal.dataset.scrollable
      disableBodyScroll(scrollable ? parentModal.querySelector(scrollable) : parentModal)
    } else {
      clearAllBodyScrollLocks()
      document.removeEventListener('keydown', handleKeyboardInput)
    }

    parent.insertBefore(modal, nextSibling)
    if (activeTrigger) {
      activeTrigger.setAttribute('aria-expanded', 'false')
      activeTrigger.focus()
    }
  }

  /**
   * Handle keyboard input
   * @param {object} e event
   */
  const handleKeyboardInput = (e) => {
    if (!tabTrap || !tabTrap.hasFocusables || !e) {
      return
    }

    const keyCode = e.keyCode || e.which

    switch (keyCode) {
      case 9: // tab
        if (e.shiftKey) {
          tabTrap.back(e)
        } else {
          tabTrap.next(e)
        }
        break
      case 27: // esc
        e.preventDefault()
        handleClose()
        break
    }
  }

  /**
   * Decision point on how the modal should be closed.
   * When the URL changes, the `popstate` event should be triggered manually,
   * otherwise we'll close the modal directly.
   */
  const handleClose = () => {
    if (options.changeHash) {
      history.back()
      return
    }
    close()
  }

  /**
   * Add a user defined throttled resizeEvent.
   */
  const addResizeEvent = () => {
    let resizeTimer
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => options.resizeEvent(open, close), 250)
    })
  }

  /**
   * Add events that handle hash changes
   */
  const addHashEvents = () => {
    window.addEventListener('hashchange', () => {
      if (hash === `#${modal.id}`) {
        close()
      }

      hash = window.location.hash
      if (hash === `#${modal.id}`) {
        open(false)
      }
    })

    if (hash === `#${modal.id}`) { // show modal on page load when the hash corresponds
      history.replaceState(null, null, window.location.href.split('#')[0])
      open()
    }
  }

  init()

  return { close: handleClose, open: open }
}
