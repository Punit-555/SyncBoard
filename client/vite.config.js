import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Plugin to generate version.json on build
const generateVersionPlugin = () => ({
  name: 'generate-version',
  buildStart() {
    const version = {
      version: process.env.npm_package_version || '1.0.0',
      buildTime: new Date().toISOString(),
      buildId: Date.now().toString()
    }

    const versionPath = path.resolve(__dirname, 'public/version.json')
    fs.writeFileSync(versionPath, JSON.stringify(version, null, 2))
    console.log('📦 Generated version.json:', version)
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), generateVersionPlugin()],
})
