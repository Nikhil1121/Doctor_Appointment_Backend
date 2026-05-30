import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import doctorModel from './models/doctorModel.js'
import { createRequire } from 'module'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const doctors = [
  { name: 'Dr. Richard James', email: 'richard@prescripto.com', speciality: 'General physician', degree: 'MBBS', experience: '4 Years', about: 'Dr. Richard has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.', fees: 50, imagePath: 'src/assets/doc1.png', address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Emily Larson', email: 'emily@prescripto.com', speciality: 'Gynecologist', degree: 'MBBS', experience: '3 Years', about: 'Dr. Emily specializes in women health and provides compassionate care with modern treatment approaches.', fees: 60, imagePath: 'src/assets/doc2.png', address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Sarah Patel', email: 'sarah@prescripto.com', speciality: 'Dermatologist', degree: 'MBBS', experience: '1 Years', about: 'Dr. Sarah is dedicated to providing the best dermatological care with focus on skin health.', fees: 30, imagePath: 'src/assets/doc3.png', address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Christopher Lee', email: 'christopher@prescripto.com', speciality: 'Pediatricians', degree: 'MBBS', experience: '2 Years', about: 'Dr. Christopher is passionate about child health and provides comprehensive pediatric care.', fees: 40, imagePath: 'src/assets/doc4.png', address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Jennifer Garcia', email: 'jennifer@prescripto.com', speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', about: 'Dr. Jennifer is an expert neurologist with experience in treating complex neurological disorders.', fees: 50, imagePath: 'src/assets/doc5.png', address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Andrew Williams', email: 'andrew@prescripto.com', speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', about: 'Dr. Andrew provides expert neurological care with a focus on patient wellbeing.', fees: 50, imagePath: 'src/assets/doc6.png', address: { line1: '67th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Christopher Davis', email: 'cdavis@prescripto.com', speciality: 'General physician', degree: 'MBBS', experience: '4 Years', about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care.', fees: 50, imagePath: 'src/assets/doc7.png', address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Timothy White', email: 'timothy@prescripto.com', speciality: 'Gynecologist', degree: 'MBBS', experience: '3 Years', about: 'Dr. Timothy provides expert gynecological care with modern treatment methods.', fees: 60, imagePath: 'src/assets/doc8.png', address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Ava Mitchell', email: 'ava@prescripto.com', speciality: 'Dermatologist', degree: 'MBBS', experience: '1 Years', about: 'Dr. Ava specializes in skin care and provides personalized dermatological treatments.', fees: 30, imagePath: 'src/assets/doc9.png', address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Jeffrey King', email: 'jeffrey@prescripto.com', speciality: 'Pediatricians', degree: 'MBBS', experience: '2 Years', about: 'Dr. Jeffrey is dedicated to providing comprehensive pediatric care.', fees: 40, imagePath: 'src/assets/doc10.png', address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Zoe Kelly', email: 'zoe@prescripto.com', speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', about: 'Dr. Zoe provides expert neurological care with compassion and expertise.', fees: 50, imagePath: 'src/assets/doc11.png', address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Patrick Harris', email: 'patrick@prescripto.com', speciality: 'Neurologist', degree: 'MBBS', experience: '4 Years', about: 'Dr. Patrick is an experienced neurologist focused on patient recovery.', fees: 50, imagePath: 'src/assets/doc12.png', address: { line1: '67th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Chloe Evans', email: 'chloe@prescripto.com', speciality: 'General physician', degree: 'MBBS', experience: '4 Years', about: 'Dr. Chloe is committed to providing comprehensive general medical care.', fees: 50, imagePath: 'src/assets/doc13.png', address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Ryan Martinez', email: 'ryan@prescripto.com', speciality: 'Gynecologist', degree: 'MBBS', experience: '3 Years', about: 'Dr. Ryan provides expert gynecological care with a patient-first approach.', fees: 60, imagePath: 'src/assets/doc14.png', address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
  { name: 'Dr. Amelia Johnson', email: 'amelia@prescripto.com', speciality: 'Dermatologist', degree: 'MBBS', experience: '1 Years', about: 'Dr. Amelia specializes in advanced dermatological treatments and skin care.', fees: 30, imagePath: 'src/assets/doc15.png', address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' } },
]

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('DB Connected ✅')

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
    console.log('Cloudinary Connected ✅')

    await doctorModel.deleteMany({})
    console.log('Old doctors removed ✅')

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('Doctor@123', salt)

    for (const doc of doctors) {
      // Frontend folder se image upload karo
      const imagePath = path.join('C:/Users/dell/Desktop/Doctor_Appointment_Frontend', doc.imagePath)
      
      console.log(`Uploading image: ${imagePath}`)
      const imageUpload = await cloudinary.uploader.upload(imagePath, { resource_type: 'image' })
      const imageUrl = imageUpload.secure_url

      await doctorModel.create({
        name: doc.name,
        email: doc.email,
        speciality: doc.speciality,
        degree: doc.degree,
        experience: doc.experience,
        about: doc.about,
        fees: doc.fees,
        image: imageUrl,
        address: doc.address,
        password: hashedPassword,
        available: true,
        date: Date.now(),
        slots_booked: {}
      })
      console.log(`Added: ${doc.name} ✅`)
    }

    console.log('All doctors seeded with real images! 🎉')
    process.exit(0)
  } catch (error) {
    console.log('Error:', error.message)
    process.exit(1)
  }
}

seedDoctors()