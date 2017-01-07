'use strict'

const parseDownloadStdout = (stdout, data) => {
  const parts = stdout.split(/ +/)
  // console.log(stdout);
  if(/^\[download\] Downloading video [1-9]+ of [1-9]+$/.test(stdout)){
    data.currentTrack.rank = parts[3]
  } else if (/^\[download\] Destination:/.test(stdout)) {
    const name = stdout.split('/').pop().split('.').slice(0 ,-1).join(".")
    data.currentTrack.title = name
  } else if (/\[download\].*of.*at.*ETA.*/.test(stdout)) { //[download]  33.4% of 3.03MiB at 586.75KiB/s ETA 00:03
    data.currentTrack.percent = parts[1]
    data.currentTrack.size = parts[3]
    data.currentTrack.speed = parts[5]
    data.currentTrack.remain = parts[7]
    if(parts[1] == '100.0%') {
      data.tracksDone.push(data.currentTrack.title)
    }
  }
  return data
}

const parseYoutubePlaylistStdout = (stdout, data) => {
  const parts = stdout.split(" ")
  if(data.playlistId === "" && parts[2] == 'Downloading' && parts[3] === 'webpage') {
    data.playlistId = parts[1]
    console.log('id = ' + data.playlistId);
    // playlist BADABOOM: Downloading 8 videos
  } else if (/Downloading [0-9]+ videos/.test(stdout)) {
    parts.pop()
    data.playlistCount = parts.pop()
    parts.pop()
    parts.shift()
    parts.shift()
    data.playlistName = parts.join(" ").trim().slice(0, -1)
    console.log("name : " + data.playlistName);
  }
  // console.log(data);
  return data
}

const parseStdout = (stdOut, data, cb) => {
  // sometime 2 or more events that should appear separated arrives in the same
  // string. So we have to split on \r and loop over before actually looking into the string.
  const out = stdOut.split(/\r|\n/)
  out.forEach((stdout) => {
    if(stdout === '') return
    stdout = stdout.trim()
    try {
      var type = stdout.match(/^\[[a-z:]+\]/)[0]
      type = type.substring(1, type.length-1).trim()
    } catch (e) {
      type = 'info'
    }
    switch (type) {
      case 'youtube:playlist':
        data = parseYoutubePlaylistStdout(stdout, data)
        break;
      case 'download':
        data = parseDownloadStdout(stdout, data)
        break;
      default:
    }
  })
  cb(data)
}

module.exports = {
  parseStdout: parseStdout
}
