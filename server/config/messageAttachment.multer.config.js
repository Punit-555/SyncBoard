import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads', 'message-attachments');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId-timestamp-originalname
    const userId = req.user?.userId || 'temp';
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${userId}-${timestamp}-${sanitizedName}`;
    cb(null, filename);
  },
});

// File filter - accept documents, images, and spreadsheets
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx|txt|csv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image\/(jpeg|jpg|png|gif|webp)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)|text\/(plain|csv)/.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp), documents (pdf, doc, docx), spreadsheets (xls, xlsx), and text files (txt, csv) are allowed'));
  }
};

// Configure multer
const uploadMessageAttachment = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export default uploadMessageAttachment;
