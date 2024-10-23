import {writeFile, writeFileSync} from "node:fs";
import path from "node:path";
import * as fs from "node:fs";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
// const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// const upload = multer({ dest: 'uploads/' })
// const upload = multer().single('avatar')

export const uploadFile = async (file: Buffer) => {
    console.log(file)

    // const uploadDir = path.join(__dirname, 'storage/upload');
    // if (!fs.existsSync(uploadDir)) {
    //     fs.mkdirSync(uploadDir, { recursive: true });
    // }
    // writeFileSync(uploadDir, file);

    upload.single('avatar')
}
