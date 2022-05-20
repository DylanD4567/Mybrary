function sectionChange(card, p) {
  const div = document.getElementById(card)
  const textP = document.getElementById(p)

  if (div.className === 'cardBox') {
    div.className = 'close'
    textP.textContent = 'Show'
  } else {
    div.className = 'cardBox'
    textP.textContent = 'Close'
  }
}


function loaded(data) {
  const toggles = document.getElementsByClassName('toggleSwitch')
  const cmds = data.split(',')
  
  for (const toggle of toggles) {
    for (const cmd of cmds) {
      if (toggle.id === cmd) toggle.checked = false
    }
  }
}


function toggleChange(cmd, guildId) {
  const toggleChecked = document.getElementById(`${cmd}`).checked

  const options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      guildId,
      command: cmd,
      active: toggleChecked
    })
  }

  fetch('/disable-cmd', options)
}