var app = {
  bookmarkLocations: [],

  init: () => {
    console.log('Started Vaxowave Extension')

    // Jupyter Notbook code collapse/expand
    app.jupyterCollapse()
    app.applyTheme()
    app.keyboardBookmarks()
  },

  stop: () => {
    console.log('Stopped Vaxowave Extension')
  },

  jupyterCollapse: () => {

    document.querySelectorAll('.prompt.input_prompt bdi').forEach(element => {
      var collapseButton = document.createElement('span')
      collapseButton.classList.add('toggle-button')

      collapseButton.onclick = (event) => {
        event.target.classList.toggle('active')
        event.target.parentNode.parentNode.parentNode.querySelector('.inner_cell').classList.toggle('collapsed-cell')
      }

      element.parentNode.insertBefore(collapseButton, element)
    })
  },

  applyTheme: () => {
    document.querySelectorAll('.CodeMirror').forEach(element => {
      element.classList.add('cm-s-monokai')
    })
  },

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
      console.log('SCROLLING TO: ' + windowLocation)

      document.getElementById('site').scrollTop = windowLocation
    })
  }

}

chrome.runtime.sendMessage({}, (response) => {
  if (response.state) {
    app.init()
  } else {
    app.stop()
  }
})