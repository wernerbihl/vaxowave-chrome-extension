var app = {
  init: () => {
    console.log('Started Vaxowave Extension')

    // Jupyter Notbook code collapse/expand
    app.jupyterCollapse()
    app.applyTheme()
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
  }

}

chrome.runtime.sendMessage({}, (response) => {
  if (response.state) {
    app.init()
  } else {
    app.stop()
  }
})