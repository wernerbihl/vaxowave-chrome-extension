var app = {
  initialized: false,
  bookmarkLocations: [],

  init: () => {
    console.log('Started Vaxowave Extension')

    app.monitorCodeDomChanges()
    app.monitorCodeRunDomChanges()

    app.jupyterCollapse(document)
    app.applyTheme(document)
    app.keyboardBookmarks()
  },

  // Need to detect when a new code block is inserted so that we can apply theme and collapse options
  monitorCodeDomChanges: () => {
    const targetNode = document.getElementById('notebook-container')
    const observerOptions = {
      childList: true,
      attributes: false,
      subtree: false
    }

    const observer = new MutationObserver((mutationList, observer) => {
      mutationList.forEach((mutation) => {
        var inputNode = mutation.addedNodes.length > 0 && mutation.addedNodes[0].childNodes.length > 0 ? mutation.addedNodes[0].childNodes[0] : null
        if (inputNode) {
          app.jupyterCollapse(inputNode)
          app.applyTheme(inputNode)
        }
      })
    })

    observer.observe(targetNode, observerOptions)
  },

  // Need to detect when a code block is run so that we can re-apply the collapse buttons after the DOM changed
  monitorCodeRunDomChanges: () => {
    const targetNode = document.getElementById('notebook-container')
    const observerOptions = {
      childList: true,
      attributes: false,
      subtree: true
    }

    const observer = new MutationObserver((mutationList, observer) => {
      mutationList.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.removedNodes.length > 0 && mutation.removedNodes[0].className === 'toggle-button') { // Toggle button removed
          const inputNode = mutation.target.parentNode
          app.jupyterCollapse(inputNode)
        }
      })
    })

    observer.observe(targetNode, observerOptions)
  },

  // Adds collapes/expand buttons to code blocks
  jupyterCollapse: (domElement) => {
    domElement.querySelectorAll('.prompt.input_prompt bdi').forEach(element => {
      var collapseButton = document.createElement('span')
      collapseButton.classList.add('toggle-button')

      collapseButton.onclick = (event) => {
        event.target.classList.toggle('active')
        event.target.parentNode.parentNode.parentNode.querySelector('.inner_cell').classList.toggle('collapsed-cell')
      }

      element.parentNode.insertBefore(collapseButton, element)
    })
  },

  // Applies a theme to the codemirror code blocks
  applyTheme: (domElement) => {
    domElement.querySelectorAll('.CodeMirror').forEach(element => {
      element.classList.add('cm-s-monokai')
    })
  },

  // Maps keyboard shortcuts for bookmarks
  keyboardBookmarks: () => {
    // Set bookmark locations to top of screen by default
    for (i = 0; i <= 9; i++) {
      app.bookmarkLocations[i] = 0
    }

    hotkeys('shift+1, shift+2, shift+3, shift+4, shift+5, shift+6, shift+7, shift+8, shift+9, shift+0', (event, handler) => {
      const bookMarkNum = handler.key.replace('shift+', '')

      app.bookmarkLocations[bookMarkNum] = document.getElementById('site').scrollTop

      GrowlNotification.notify({
        title: 'Bookmark #' + bookMarkNum + ' set',
        description: 'Press Alt+' + bookMarkNum + ' to jump to location',
        type: 'success',
        closeTimeout: 2500,
        showProgress: true
      })
    })

    hotkeys('alt+1, alt+2, alt+3, alt+4, alt+5, alt+6, alt+7, alt+8, alt+9, alt+0', (event, handler) => {
      const bookMarkNum = handler.key.replace('alt+', '')
      const windowLocation = app.bookmarkLocations[bookMarkNum]

      document.getElementById('site').scrollTop = windowLocation
    })
  }
}

window.addEventListener('load', () => {
  app.init()
})