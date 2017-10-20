import netlifyIdentity from 'netlify-identity-widget'

const SITE_NAME_PREFIX = `https://`
const SITE_NAME_SUFFIX = `.netlify.com`
const PROVIDER = `netlify-identity`

function initNetlifyidentity () {
  netlifyIdentity.init()
  netlifyIdentity.on('open', allowModalClickEvents)
  netlifyIdentity.on('login', closeModal)
}

function setNetlifySite (site) {
  localStorage.setItem('netlifySiteURL', site)
}

function allowModalClickEvents () {
  const netlifyModal = document.querySelector('#netlify-identity-widget')
  if (netlifyModal) netlifyModal.style.pointerEvents = 'all'
}

function openModal () {
  netlifyIdentity.open()
  allowModalClickEvents()
}

function closeModal () {
  netlifyIdentity.close()
}

function openNetlifyModal () {
  return new Promise((resolve, reject) => {
    const currentUser = netlifyIdentity.currentUser()
    if (!currentUser) {
      console.log('No user logged in, opening login modal')
      openModal()
      netlifyIdentity.on('login', user => resolve(user))
    } else {
      resolve(currentUser)
    }
  })
}

function authorize (user) {
  return new Promise((resolve, reject) => {
    if (!user || !user.token || !user.token.access_token) {
      reject(new Error('Invalid user token'))
    }
    resolve({
      token: user.token.access_token,
      provider: PROVIDER
    })

    return true
  })
}

function awaitLogout (payload) {
  let stateObserver = window.Simpla.observeState('authenticated', value => {
    if (value !== true) {
      netlifyIdentity.logout()
      // Destroy observer
      stateObserver.unobserve()
    }
  })
  return payload
}

function patchFetch (authUrl) {
  // HACK: delete me when possible
  const oldFetch = window.fetch
  function newFetch (url, config) {
    if (config && config.headers && config.headers.Authorization) {
      config.headers.Authorization = config.headers.Authorization.replace('token', 'Bearer')
    }
    url = url.replace('https://api.github.com/repos/jinksi/hyperstatic/', `${authUrl}/.netlify/git/github/`)
    arguments[0] = url
    arguments[1] = config
    return oldFetch.apply(this, arguments)
  }
  fetch = newFetch
}

export default class NetlifyIdentityAuthentication {
  constructor ({ site }) {
    if (site) {
      this._authUrl = SITE_NAME_PREFIX + site + SITE_NAME_SUFFIX
      setNetlifySite(this._authUrl)
    }
    initNetlifyidentity()
    patchFetch(this._authUrl)
  }

  authenticate () {
    const authFlow = openNetlifyModal()
      .then(authorize)
      .then(awaitLogout)
    return authFlow
  }
}
