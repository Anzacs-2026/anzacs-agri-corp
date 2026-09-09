// One-off script: uploads the local crop photos to Supabase Storage and
// attaches each as its product's primary photo. Unlike the SQL seed file,
// this step genuinely cannot be done via SQL — the Storage API needs real
// credentials and can't be reached from the SQL Editor.
//
// Run locally: node scripts/attach-product-photos.mjs
// Requires a root .env with:
//   VITE_SUPABASE_URL=...
//   SUPABASE_SERVICE_ROLE_KEY=...
// (same variables the Netlify function and RLS integration test use —
// never committed, never sent anywhere except your own Supabase project).
//
// Safe to re-run: skips any product that already has a primary_photo_id.

import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the root .env — aborting.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)
const cropsDir = path.resolve(__dirname, '../apps/web/public/crops')

// slug -> image filename in apps/web/public/crops/
const PHOTO_MAP = {
  'bottle-gourd-f1-julia': '01-BOTTLE-GOURD-F1-JULIA-008.jpg',
  'bottle-gourd-f1-sophia': '02-BOTTLE-GOURD-F1-SOPHIA-003.jpg',
  'okra-f1-glory': '03-OKRA-F1-GLORY-e1633438769603.jpg',
  'bitter-gourd-f1-euro': '04-BITTER-GOURD-F1-EURO.jpg',
  'bitter-gourd-f1-polo': '05-BITTER-GOURD-F1-POLO.jpg',
  'cucumber-f1-discovery': '06-CUCUMBER-F1-DISCOVERY.jpg',
  'cucumber-f1-poly': '07-CUCUMBER-F1-POLY.jpg',
  'capsicum-f1-green': '08-CAPSICUM-F1-GREEN.jpg',
  'capsicum-f1-wisdom': '09-CAPSICUM-F1-WISDOM.jpg',
  'ridge-gourd-f1-laila': '10-RIDGE-GOURD-F1-LAILA.jpg',
  'chilli-f1-nat': '11-CHILLI-F1-NAT.jpg',
  'chilli-f1-zeidan': '12-CHILLI-F1-ZEIDAN.jpg',
  'chilli-f1-bill': '13-CHILLI-F1-BILL.jpg',
  'watermelon-f1-honey': '14-WATERMELON-F1-HONEY-852.jpg',
  'watermelon-f1-baby': '15-WATERMELON-F1-BABY.jpg',
  'tomato-f1-rome': '16-TOMATTO-F1-ROME-50.jpg',
  'tomato-f1-dore': '17-Tomato-f1-dore-55.jpg',
  'tomato-f1-moriyan': '18-TOMATTO-F1-MORIYAN.jpg',
  'tomato-f1-king': '19-TOMATTO-F1-KING.jfif_.jpg',
  'cabbage-f1-dolphin': '20-CABBAGE-F1-DOLPHIN.jpg',
  // Open Pollinated — mapping confirmed against anzacs.in's own gallery markup
  'carrot-red-core': 'Screenshot-2021-10-28-at-9.35.57-AM.png',
  cauliflower: 'Screenshot-2021-10-28-at-9.36.24-AM.png',
  'peas-nz': 'Screenshot-2021-10-28-at-9.36.52-AM.png',
  'basil-green': 'Screenshot-2021-10-28-at-9.37.18-AM.png',
}

const contentTypeFor = (ext) => (ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`)

const attachPhoto = async (slug, filename) => {
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, primary_photo_id')
    .eq('slug', slug)
    .maybeSingle()

  if (productError) {
    console.error(`${slug}: lookup failed — ${productError.message}`)
    return
  }
  if (!product) {
    console.warn(`${slug}: no product found, skipping (run supabase/seed/products.sql first?)`)
    return
  }
  if (product.primary_photo_id) {
    console.log(`${product.name}: already has a photo, skipping`)
    return
  }

  let fileBuffer
  try {
    fileBuffer = await readFile(path.join(cropsDir, filename))
  } catch {
    console.warn(`${product.name}: image file not found at ${filename}, skipping`)
    return
  }

  const ext = path.extname(filename).replace('.', '').split('_')[0] || 'jpg'
  const storagePath = `${product.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(storagePath, fileBuffer, { contentType: contentTypeFor(ext) })

  if (uploadError) {
    console.error(`${product.name}: upload failed — ${uploadError.message}`)
    return
  }

  const { data: photo, error: photoError } = await supabase
    .from('photos')
    .insert({ product_id: product.id, storage_path: storagePath })
    .select('id')
    .single()

  if (photoError) {
    console.error(`${product.name}: photo row failed — ${photoError.message}`)
    return
  }

  const { error: updateError } = await supabase
    .from('products')
    .update({ primary_photo_id: photo.id })
    .eq('id', product.id)

  if (updateError) {
    console.error(`${product.name}: setting primary photo failed — ${updateError.message}`)
    return
  }

  console.log(`${product.name}: done`)
}

const entries = Object.entries(PHOTO_MAP)
for (const [slug, filename] of entries) {
  await attachPhoto(slug, filename)
}

console.log(`Finished — processed ${entries.length} products.`)
