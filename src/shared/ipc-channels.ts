export const IPC = {
  // Settings
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',

  // Sources
  SOURCES_LIST: 'sources:list',
  SOURCES_ADD: 'sources:add',
  SOURCES_REMOVE: 'sources:remove',
  SOURCES_TOGGLE: 'sources:toggle',
  SOURCES_SELECT_DIR: 'sources:select-dir',

  // Scanner
  SCANNER_START: 'scanner:start',
  SCANNER_STOP: 'scanner:stop',
  SCANNER_PROGRESS: 'scanner:progress',

  // Library
  LIBRARY_GET_TRACKS: 'library:get-tracks',
  LIBRARY_GET_ALBUMS: 'library:get-albums',
  LIBRARY_GET_ARTISTS: 'library:get-artists',
  LIBRARY_GET_FOLDERS: 'library:get-folders',
  LIBRARY_SEARCH: 'library:search',
  LIBRARY_GET_STATS: 'library:get-stats',
  LIBRARY_TOGGLE_FAVORITE: 'library:toggle-favorite',
  LIBRARY_INCREMENT_PLAY: 'library:increment-play',

  // Playlists
  PLAYLIST_LIST: 'playlist:list',
  PLAYLIST_CREATE: 'playlist:create',
  PLAYLIST_DELETE: 'playlist:delete',
  PLAYLIST_RENAME: 'playlist:rename',
  PLAYLIST_GET_TRACKS: 'playlist:get-tracks',
  PLAYLIST_ADD_TRACK: 'playlist:add-track',
  PLAYLIST_REMOVE_TRACK: 'playlist:remove-track',

  // Playback session
  SESSION_GET: 'session:get',
  SESSION_SAVE: 'session:save',

  // File ops
  FILE_GET_ARTWORK: 'file:get-artwork',
  FILE_OPEN_FOLDER: 'file:open-folder',

  // Drag & drop
  SOURCES_ADD_PATHS: 'sources:add-paths',

  // Tag editor
  LIBRARY_UPDATE_TRACK: 'library:update-track',
} as const
