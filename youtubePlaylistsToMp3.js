// just launch node on this file.
/*
  There is a lot to do here.
  TODO:
    -youtube-dl fail to write thumbnail to mp3 file. We need to do it by hand.
    - display is ugly as fuck. SO: first create a data structure around spawned
      processes. Including playlist rank, track rank, track intel, playlist intel.
      Then build a "lib" to retrieve what's the outuput is talking about and insert it into
      correct data structure.
      then on events trigger display on correc data structure.
      The display should be able to see files being downloaded, in splitted screens
      with total status and specific status (for each song/each playlist)
    - on end mark correct data structure as finished and exit when it's all good.
    -could be really good to extract metadata from file name as well, and write it in the mp3 file.

*/
/*
full cmd exemple:
youtube-dl
-4
--no-check-certificate
--no-warnings
-i
-k
--extract-audio
--audio-format mp3 PL-THY7w0kcYSe8Ul1KPIPS3-xV8l9wVqP
-o ./%(playlist_title)s/%(playlist_index)s_%(title)s.%(ext)s
--print-json
*/
'use strict'

// Stuff you can change:
const destPath = '/home/dk/Lab/js/youtubePlaylistsToMp3/zik/'
const destPathFormated = destPath + '%(playlist_title)s/%(playlist_index)s_%(title)s.%(ext)s'

const playlistIds = [
'PL9mC8MCWYBj3g8xmoaCDGmnv8JavgzWEd',
'PL9mC8MCWYBj0cLCKMkwnPR-TlbUOavoDh',
'PLJK-J3dfQ5FUIUi89Su5p9AcIFDYeey24',
'PL9mC8MCWYBj2jQvaCSEKE2wzdUbZ8I6Ju',
'PL-THY7w0kcYTeVb_BF3arlFlu5dKn_HNe',
'PL-THY7w0kcYSe8Ul1KPIPS3-xV8l9wVqP',
]

//stuff you should maybe not change too much (excpet if you want to do the TODO list ofc)
const child_process   = require('child_process')

const downloadPlaylists = (playlist) => {
  const program       = 'youtube-dl'
  const safetyArgs    = ['-4', '--no-warnings', '-i']
  const audioArgs     = ['-x', '--audio-format', 'mp3']
  const outputArgs    = ['-o', destPathFormated]
  const metaDataArgs  = ['--embed-thumbnail', '--write-info-json']

  const dlChilds = []
  let count = playlistIds.length -1

  for (let i = playlistIds.length - 1; i >= 0; i--) {

    const idPlaylist = playlistIds[i]
    const fullArgs = [...safetyArgs, ...audioArgs, idPlaylist, ...outputArgs, ...metaDataArgs, toJsonArgs]

    dlChilds[i] = child_process.spawn(program, fullArgs)
    dlChilds[i].on('error', err => console.log('error!', err) )
    dlChilds[i].stdout.on('data', data =>  console.log(data.toString('UTF8')) )
    dlChilds[i].stderr.on('data', data => console.log(`stderr: ${data}`) )
    dlChilds[i].on('close', code => console.log(`child process exited with code ${code}`) )
  }
}

downloadPlaylists(playlistIds)
