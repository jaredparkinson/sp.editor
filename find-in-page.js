const {
  ipcRenderer,
  webContents
} = require('electron');

ipcRenderer.on('search-close', (event, arg) => {
  console.log(arg) // prints "ping"
  // document.querySelector('body').classList.add('close');
  event.returnValue = 'pong'
})
ipcRenderer.on('search-results', (event, arg) => {
  //   alert(arg);
  console.log(arg) // prints "ping"
  // document.querySelector('body').classList.add('close');
  document.getElementById('results').textContent = arg;
  event.returnValue = 'pong'
})
ipcRenderer.on('found-in-page', e => {
  //   alert('thcugctuvuy');
  console.log(e.result + ' results');
});
ipcRenderer.on('search-open', (event, arg) => {
  console.log(arg) // prints "ping"

  document.getElementById('searchBox').value = '';
  document.getElementById('searchBox').focus(); // = '';

  event.returnValue = 'pong'
})

function clearSearch() {

  document.getElementById('searchBox').value = '';
  document.getElementById('results').textContent = 'No Results';
  ipcRenderer.send('search-clear', 'ping');

  // document.querySelector('body').classList.add('close');
  // ipcRenderer.send('search-close', 'close');
}

function closeSearch() {
  clearSearch();

  ipcRenderer.send('search-close', 'close');
}

function escape(event) {
  //   alert(event.key);
  if (event.key == 'Escape') {
    closeSearch();
  }
  if (event.shiftKey && event.key === 'Enter') {
    searchTextChange('back');
  } else if (event.key == 'Enter') {
    searchTextChange('forward');
  }
}

function searchTextChange(direction) {
  if (document.getElementById('searchBox').value.trim().length <= 0) {
    // alert((document.getElementById('searchBox').value.trim().length));
    this.clearSearch();
  } else {
    switch (direction) {
      case 'forward':
        {
          //   console.log(this.normalizeSearchText());

          ipcRenderer.send('search-forward', document.getElementById('searchBox').value);
          break;
        }
      case 'back':
        {
          ipcRenderer.send('search-back', document.getElementById('searchBox').value);
          break;
        }
      default:
        {
          clearSearch();
          break;
        }
    }
    document.getElementById('searchBox').focus();
  }
}
