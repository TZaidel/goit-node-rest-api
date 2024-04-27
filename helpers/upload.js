import multer from 'multer'
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const tmpDir = path.join(__dirname, "../", "tmp")

const multerConfig = multer.diskStorage({
  destination: tmpDir,
})

const upload = multer({
  storage: multerConfig
})

export default upload
