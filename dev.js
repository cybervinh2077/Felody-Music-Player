#!/usr/bin/env node
// Wrapper to ensure ELECTRON_RUN_AS_NODE is not set when launching Electron
delete process.env.ELECTRON_RUN_AS_NODE

const { spawn } = require('child_process')
const cmd = process.platform === 'win32' ? 'electron-vite.cmd' : 'electron-vite'
const ps = spawn(cmd, ['dev'], { stdio: 'inherit', env: process.env, shell: true })
ps.on('exit', (code) => process.exit(code ?? 0))
