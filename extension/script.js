var app = {
  init: () => {
    console.log('Started Vaxowave Extension')

    // Jupyter Notbook code collapse/expand
    app.jupyterCollapse()
  },

  stop: () => {
    console.log('Stopped Vaxowave Extension')
  },

  jupyterCollapse: () => {
    let addSvg = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>'
    let subSvg = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg>'

    document.querySelectorAll('.prompt.input_prompt bdi').forEach(element => {
      var collapseButton = document.createElement('span')
      collapseButton.innerHTML = subSvg
      collapseButton.classList.add('toggle-button')

      collapseButton.onclick = (event) => {
        event.target.parentNode.classList.toggle('active')
      }

      element.parentNode.insertBefore(collapseButton, element)
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