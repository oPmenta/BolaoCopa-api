import multer from 'multer';
import path from 'path';
import { randomBytes } from 'crypto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/comprovantes/');
  },
  filename: (req, file, cb) => {
    const unique = randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `comprovante-${Date.now()}-${unique}${ext}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo inválido. Apenas JPG, PNG, PDF são permitidos.'));
  }
};

export const upload = multer({ storage, fileFilter });