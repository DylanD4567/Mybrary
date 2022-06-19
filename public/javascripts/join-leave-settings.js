// Join JS
const welcomeMessage = document.getElementById('join-message')
const switchJoin = document.getElementById('switch-join')
const errorMessage = document.getElementById('errorMessage')
const successMessage = document.getElementById('successMessage')

function joinChange(guildId) {
  if (switchJoin.checked === false) {
    welcomeMessage.classList.add('hide')

    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        guildId
      })
    }

    fetch('/joinMessageDelete', options)

  } else {
    welcomeMessage.classList.remove('hide')

    const message = document.getElementById('textareaJoin').value
    const channelId = document.getElementById('selectJoinId').value

    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        guildId,
        message,
        channelId
      })
    }
  
    fetch('/joinMessageAdd', options)
  }
}


function saveClicked(guildId) {
  const message = document.getElementById('textareaJoin').value
  const channelId = document.getElementById('selectJoinId').value

  if (message === null || message === '' || channelId === null || channelId === '') {
    errorMessage.classList.remove('hide')

    setTimeout(() => {
      errorMessage.classList.add('hide')
    }, 1000 * 5);
    return
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      guildId,
      message,
      channelId
    })
  }

  fetch('/joinMessageAdd', options)
  
  successMessage.classList.remove('hide')
  
  setTimeout(() => {
    successMessage.classList.add('hide')
  }, 1000 * 5);
}



// Leave JS
const leaveMessage = document.getElementById('leave-message')
const switchLeave = document.getElementById('switch-leave')
const errorMessageLeave = document.getElementById('errorMessageLeave')
const successMessageLeave = document.getElementById('successMessageLeave')

function leaveChange(guildId) {
  if (switchLeave.checked === false) {
    leaveMessage.classList.add('hide')

    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        guildId
      })
    }
    
    fetch('/leaveMessageDelete', options)
    
  } else {
    leaveMessage.classList.remove('hide')
    
    const message = document.getElementById('textareaLeave').value
    const channelId = document.getElementById('selectLeaveId').value
    
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        guildId,
        message,
        channelId
      })
    }
    
    fetch('/leaveMessageAdd', options)
  }
}

function saveClickedLeave(guildId) {
  const message = document.getElementById('textareaLeave').value
  const channelId = document.getElementById('selectLeaveId').value

  if (message === null || message === '' || channelId === null || channelId === '') {
    errorMessageLeave.classList.remove('hide')

    setTimeout(() => {
      errorMessageLeave.classList.add('hide')
    }, 1000 * 5);
    return
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      guildId,
      message,
      channelId
    })
  }

  fetch('/leaveMessageAdd', options)
  
  successMessageLeave.classList.remove('hide')
  
  setTimeout(() => {
    successMessageLeave.classList.add('hide')
  }, 1000 * 5);
}



// Both
function loaded(activeJoin, activeLeave) {
  if (activeJoin === 'true') {
    switchJoin.checked = true
    welcomeMessage.classList.remove('hide')
  } else {
    switchJoin.checked = false
  }

  if (activeLeave === 'true') {
    switchLeave.checked = true
    leaveMessage.classList.remove('hide')
  } else {
    switchLeave.checked = false
  }
}