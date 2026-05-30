import { v2 as cloudinary } from 'cloudinary'
import 'dotenv/config'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const upload = async () => {
  try {
    const result = await cloudinary.uploader.upload(
      'C:/Users/dell/Downloads/Scanner.jpeg',
      { public_id: 'scanner', resource_type: 'image' }
    )
    console.log('QR Uploaded! ✅ URL:', result.secure_url)
  } catch (error) {
    console.log('Error:', error.message)
  }
}

upload()