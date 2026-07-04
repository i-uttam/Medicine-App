/**
 * Seed script — populates categories and medicines from the pharma-app mock data.
 * Run with: node scripts/seed.mjs
 */
import pg from '/home/runner/workspace/node_modules/.pnpm/pg@8.22.0/node_modules/pg/lib/index.js';

const url = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!url) throw new Error('Neither SUPABASE_DB_URL nor DATABASE_URL is set');

const pool = new pg.Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

const CATEGORIES = [
  { slug: 'tablets',     label: 'Tablets',         icon: 'pill',            color: '#4285F4' },
  { slug: 'capsules',    label: 'Capsules',         icon: 'pill-multiple',   color: '#EA4335' },
  { slug: 'injections',  label: 'Injections',       icon: 'needle',          color: '#F44336' },
  { slug: 'syrups',      label: 'Syrups',           icon: 'bottle-tonic-plus', color: '#00BCD4' },
  { slug: 'cream',       label: 'Cream & Gel',      icon: 'lotion-plus',     color: '#FF9800' },
  { slug: 'surgical',    label: 'Surgical',         icon: 'bandage',         color: '#9C27B0' },
  { slug: 'ayurvedic',   label: 'Ayurvedic',        icon: 'leaf',            color: '#34A853' },
  { slug: 'supplements', label: 'Supplements',      icon: 'nutrition',       color: '#FF5722' },
  { slug: 'otc',         label: 'OTC',              icon: 'shield-plus',     color: '#607D8B' },
  { slug: 'baby',        label: 'Baby Care',        icon: 'baby-face',       color: '#E91E63' },
  { slug: 'devices',     label: 'Medical Devices',  icon: 'thermometer',     color: '#F44336' },
];

const MEDICINES = [
  { slug:'m001', name:'Paracetamol 500mg', genericName:'Paracetamol', brand:'Calpol', strength:'500mg', packSize:'Strip of 15 Tablets', category:'tablets', mrp:55, wholesalePrice:38, discount:31, stock:2400, manufacturer:'GlaxoSmithKline', gstRate:12, description:'Paracetamol 500mg is a widely used analgesic and antipyretic for mild to moderate pain and fever.', composition:'Paracetamol IP 500mg', uses:['Fever','Headache','Toothache','Body ache','Cold & flu'], dosage:'1–2 tablets every 4–6 hours. Max 8 tablets/day.', sideEffects:['Nausea','Allergic reactions (rare)','Liver damage on overdose'], storage:'Store below 30°C. Keep away from moisture and sunlight.', prescriptionRequired:false, iconName:'pill', iconColor:'#4285F4' },
  { slug:'m002', name:'Amoxicillin 500mg', genericName:'Amoxicillin', brand:'Mox-500', strength:'500mg', packSize:'Strip of 10 Capsules', category:'capsules', mrp:115, wholesalePrice:82, discount:29, stock:1800, manufacturer:'Ranbaxy', gstRate:12, description:'Amoxicillin is a broad-spectrum penicillin antibiotic used for treating bacterial infections.', composition:'Amoxicillin Trihydrate IP 500mg', uses:['Respiratory tract infections','Urinary tract infections','Skin infections','Ear infections'], dosage:'1 capsule 3 times a day or as prescribed.', sideEffects:['Diarrhoea','Nausea','Skin rash','Allergic reactions'], storage:'Store in a cool, dry place below 25°C.', prescriptionRequired:true, iconName:'pill-multiple', iconColor:'#EA4335' },
  { slug:'m003', name:'Metformin 500mg', genericName:'Metformin HCl', brand:'Glycomet', strength:'500mg', packSize:'Strip of 20 Tablets', category:'tablets', mrp:48, wholesalePrice:32, discount:33, stock:3200, manufacturer:'USV Ltd', gstRate:12, description:'Metformin is an oral diabetes medicine used to control blood sugar levels in type-2 diabetes.', composition:'Metformin Hydrochloride IP 500mg', uses:['Type-2 Diabetes Mellitus','Polycystic Ovary Syndrome (PCOS)'], dosage:'1 tablet twice daily with meals, or as prescribed.', sideEffects:['Nausea','Diarrhoea','Stomach upset','Lactic acidosis (rare)'], storage:'Store at room temperature. Keep in a tight container.', prescriptionRequired:true, iconName:'pill', iconColor:'#0F9D58' },
  { slug:'m004', name:'Amlodipine 5mg', genericName:'Amlodipine Besylate', brand:'Amlip-5', strength:'5mg', packSize:'Strip of 10 Tablets', category:'tablets', mrp:42, wholesalePrice:28, discount:33, stock:1500, manufacturer:'Cipla', gstRate:12, description:'Amlodipine is a calcium channel blocker used for high blood pressure and angina.', composition:'Amlodipine Besylate 6.93mg equiv. to Amlodipine 5mg', uses:['Hypertension','Angina pectoris','Coronary artery disease'], dosage:'1 tablet once daily. Dose may be increased to 10mg.', sideEffects:['Oedema','Headache','Dizziness','Flushing','Palpitations'], storage:'Store below 30°C. Protect from light.', prescriptionRequired:true, iconName:'heart-pulse', iconColor:'#F44336' },
  { slug:'m005', name:'Azithromycin 500mg', genericName:'Azithromycin', brand:'Azithral', strength:'500mg', packSize:'Strip of 3 Tablets', category:'tablets', mrp:88, wholesalePrice:61, discount:31, stock:900, manufacturer:'Alembic', gstRate:12, description:'Azithromycin is a macrolide antibiotic used to treat bacterial infections.', composition:'Azithromycin Dihydrate IP 500mg', uses:['Community-acquired pneumonia','Pharyngitis','Skin infections','STIs'], dosage:'1 tablet once daily for 3–5 days or as prescribed.', sideEffects:['Nausea','Abdominal pain','Diarrhoea','QT prolongation (rare)'], storage:'Store below 30°C in a dry place.', prescriptionRequired:true, iconName:'pill', iconColor:'#9C27B0' },
  { slug:'m006', name:'Omeprazole 20mg', genericName:'Omeprazole', brand:'Omez', strength:'20mg', packSize:'Strip of 10 Capsules', category:'capsules', mrp:72, wholesalePrice:49, discount:32, stock:2100, manufacturer:'Dr. Reddy\'s', gstRate:12, description:'Omeprazole is a proton pump inhibitor reducing stomach acid.', composition:'Omeprazole IP 20mg', uses:['GERD','Peptic ulcer','Zollinger-Ellison syndrome'], dosage:'1 capsule daily before breakfast for 4–8 weeks.', sideEffects:['Headache','Diarrhoea','Nausea','Hypomagnesaemia'], storage:'Store below 25°C. Keep in original packaging.', prescriptionRequired:false, iconName:'stomach', iconColor:'#FF9800' },
  { slug:'m007', name:'Atorvastatin 10mg', genericName:'Atorvastatin Calcium', brand:'Atorva', strength:'10mg', packSize:'Strip of 10 Tablets', category:'tablets', mrp:58, wholesalePrice:40, discount:31, stock:1200, manufacturer:'Zydus', gstRate:12, description:'Atorvastatin is a statin used to lower cholesterol and triglycerides.', composition:'Atorvastatin Calcium equiv. to Atorvastatin 10mg', uses:['Hypercholesterolaemia','Prevention of cardiovascular events'], dosage:'1 tablet daily at bedtime.', sideEffects:['Myalgia','Elevated liver enzymes','Headache','GI disturbances'], storage:'Store below 30°C. Protect from moisture.', prescriptionRequired:true, iconName:'heart', iconColor:'#E91E63' },
  { slug:'m008', name:'Cetirizine 10mg', genericName:'Cetirizine HCl', brand:'Alerid', strength:'10mg', packSize:'Strip of 10 Tablets', category:'tablets', mrp:35, wholesalePrice:22, discount:37, stock:3500, manufacturer:'Cipla', gstRate:12, description:'Cetirizine is a second-generation antihistamine for allergic conditions.', composition:'Cetirizine Hydrochloride IP 10mg', uses:['Allergic rhinitis','Urticaria','Hay fever','Itching'], dosage:'1 tablet once daily in the evening.', sideEffects:['Drowsiness','Dry mouth','Headache'], storage:'Store below 30°C.', prescriptionRequired:false, iconName:'pill', iconColor:'#00BCD4' },
  { slug:'m009', name:'Pantoprazole 40mg', genericName:'Pantoprazole Sodium', brand:'Pantocid', strength:'40mg', packSize:'Strip of 15 Tablets', category:'tablets', mrp:95, wholesalePrice:66, discount:31, stock:1800, manufacturer:'Sun Pharma', gstRate:12, description:'Pantoprazole is a proton pump inhibitor used for acid-related disorders.', composition:'Pantoprazole Sodium Sesquihydrate IP equiv. to Pantoprazole 40mg', uses:['GERD','Peptic ulcer','H. pylori eradication'], dosage:'1 tablet daily before meals. Swallow whole; do not crush.', sideEffects:['Headache','Flatulence','Diarrhoea'], storage:'Store below 25°C. Protect from moisture.', prescriptionRequired:true, iconName:'pill', iconColor:'#795548' },
  { slug:'m010', name:'Vitamin D3 60000 IU', genericName:'Cholecalciferol', brand:'Calcirol', strength:'60000 IU', packSize:'Strip of 4 Capsules', category:'supplements', mrp:148, wholesalePrice:102, discount:31, stock:2800, manufacturer:'Cadila', gstRate:5, description:'Vitamin D3 supplement for deficiency management and bone health.', composition:'Cholecalciferol (Vitamin D3) 60000 IU', uses:['Vitamin D deficiency','Osteoporosis prevention','Immune support'], dosage:'1 capsule weekly or as prescribed.', sideEffects:['Hypercalcaemia on overdose','Nausea','Weakness'], storage:'Store below 25°C. Protect from light.', prescriptionRequired:false, iconName:'white-balance-sunny', iconColor:'#FFC107' },
  { slug:'m011', name:'Dolo 650mg', genericName:'Paracetamol', brand:'Dolo', strength:'650mg', packSize:'Strip of 15 Tablets', category:'tablets', mrp:30, wholesalePrice:21, discount:30, stock:5000, manufacturer:'Micro Labs', gstRate:12, description:'Dolo 650 is a paracetamol tablet widely used in India for fever, pain, and COVID-19 management.', composition:'Paracetamol IP 650mg', uses:['Fever','Headache','Body ache','Toothache'], dosage:'1 tablet every 4–6 hours. Max 4 tablets/day.', sideEffects:['Nausea','Liver toxicity on overdose'], storage:'Store below 25°C. Keep dry.', prescriptionRequired:false, iconName:'pill', iconColor:'#3F51B5' },
  { slug:'m012', name:'Insulin Glargine 100IU/mL', genericName:'Insulin Glargine', brand:'Lantus', strength:'100 IU/mL', packSize:'Vial of 10mL', category:'injections', mrp:850, wholesalePrice:612, discount:28, stock:400, manufacturer:'Sanofi', gstRate:12, description:'Long-acting basal insulin for type-1 and type-2 diabetes mellitus.', composition:'Insulin Glargine 100 IU/mL', uses:['Type-1 Diabetes','Type-2 Diabetes (basal insulin)'], dosage:'Inject subcutaneously once daily at the same time. Dose as prescribed.', sideEffects:['Hypoglycaemia','Injection site reactions','Lipodystrophy'], storage:'Unopened: 2–8°C. In use: below 30°C, use within 28 days.', prescriptionRequired:true, iconName:'needle', iconColor:'#00ACC1' },
  { slug:'m013', name:'Betamethasone Cream 0.05%', genericName:'Betamethasone Valerate', brand:'Betnovate', strength:'0.05%', packSize:'Tube of 20g', category:'cream', mrp:78, wholesalePrice:54, discount:31, stock:1100, manufacturer:'GSK', gstRate:12, description:'Betamethasone valerate cream for inflammatory and allergic skin conditions.', composition:'Betamethasone Valerate IP 0.05% w/w', uses:['Eczema','Psoriasis','Contact dermatitis','Allergic skin reactions'], dosage:'Apply thinly to affected area 1–2 times daily.', sideEffects:['Skin thinning','Striae','Local irritation','Perioral dermatitis'], storage:'Store below 25°C. Do not freeze.', prescriptionRequired:true, iconName:'lotion-plus', iconColor:'#FF9800' },
  { slug:'m014', name:'Amoxicillin-Clavulanate 625mg', genericName:'Amoxicillin + Clavulanic Acid', brand:'Augmentin', strength:'500mg+125mg', packSize:'Strip of 10 Tablets', category:'tablets', mrp:210, wholesalePrice:148, discount:30, stock:800, manufacturer:'GSK', gstRate:12, description:'Augmentin combines amoxicillin with clavulanate to overcome antibiotic resistance.', composition:'Amoxicillin Trihydrate 500mg + Clavulanate Potassium 125mg', uses:['Sinusitis','Otitis media','Lower respiratory tract infections','UTI'], dosage:'1 tablet twice daily with meals.', sideEffects:['Diarrhoea','Nausea','Skin rash','Hepatitis (rare)'], storage:'Store in a refrigerator at 2–8°C. Keep dry.', prescriptionRequired:true, iconName:'pill', iconColor:'#673AB7' },
  { slug:'m015', name:'Cough Syrup with Codeine', genericName:'Codeine Phosphate + Chlorpheniramine', brand:'Corex', strength:'10mg+4mg per 5mL', packSize:'Bottle of 100mL', category:'syrups', mrp:145, wholesalePrice:100, discount:31, stock:600, manufacturer:'Pfizer', gstRate:12, description:'Schedule H1 cough syrup with codeine for dry irritating cough.', composition:'Codeine Phosphate 10mg + Chlorpheniramine Maleate 4mg per 5mL', uses:['Dry cough','Allergic cough'], dosage:'5–10mL every 4–6 hours. Not for children under 12.', sideEffects:['Drowsiness','Constipation','Nausea','Dependence potential'], storage:'Store below 25°C. Keep away from children.', prescriptionRequired:true, iconName:'bottle-tonic-plus', iconColor:'#F44336' },
  { slug:'m016', name:'Multivitamin & Multimineral', genericName:'Multivitamin', brand:'Becosules', strength:'Standard formula', packSize:'Bottle of 20 Capsules', category:'supplements', mrp:88, wholesalePrice:60, discount:32, stock:4000, manufacturer:'Pfizer', gstRate:5, description:'Complete multivitamin and multimineral supplement for daily nutritional support.', composition:'Vit B-complex, C, D3, E + Zinc, Iron, Calcium', uses:['Nutritional deficiency','Post-illness recovery','General health'], dosage:'1 capsule daily after breakfast.', sideEffects:['Yellow-orange urine (B2)','GI upset on empty stomach'], storage:'Store below 25°C in a dry place.', prescriptionRequired:false, iconName:'nutrition', iconColor:'#FF5722' },
  { slug:'m017', name:'Surgical Gloves (Latex)', genericName:'Latex Examination Gloves', brand:'Ansell', strength:'N/A', packSize:'Box of 100 Pieces', category:'surgical', mrp:320, wholesalePrice:225, discount:30, stock:500, manufacturer:'Ansell Healthcare', gstRate:12, description:'Powder-free latex examination gloves for medical and surgical use.', composition:'Natural rubber latex', uses:['Medical examination','Surgical procedures','Wound dressing'], dosage:'N/A', sideEffects:['Latex allergy in sensitive individuals'], storage:'Store in a cool, dry place away from sunlight.', prescriptionRequired:false, iconName:'bandage', iconColor:'#9C27B0' },
  { slug:'m018', name:'Triphala Churna', genericName:'Triphala', brand:'Dabur', strength:'Standard', packSize:'Pack of 500g', category:'ayurvedic', mrp:185, wholesalePrice:128, discount:31, stock:1200, manufacturer:'Dabur India', gstRate:12, description:'Classical Ayurvedic formulation combining three fruits for digestion and detoxification.', composition:'Amalaki (Emblica officinalis) + Bibhitaki (Terminalia bellirica) + Haritaki (Terminalia chebula) equal parts', uses:['Constipation','Digestive disorders','Eye health','Detoxification'], dosage:'3–6g with warm water at bedtime.', sideEffects:['Loose stools at high doses','Mild GI discomfort initially'], storage:'Store in an airtight container in a cool, dry place.', prescriptionRequired:false, iconName:'leaf', iconColor:'#34A853' },
  { slug:'m019', name:'Glucometer Strips', genericName:'Blood Glucose Test Strips', brand:'Accu-Chek', strength:'Compatible with Accu-Chek Active', packSize:'Pack of 25 Strips', category:'devices', mrp:295, wholesalePrice:207, discount:30, stock:750, manufacturer:'Roche Diagnostics', gstRate:12, description:'Accu-Chek Active blood glucose test strips for self-monitoring of blood glucose.', composition:'Glucose oxidase enzyme strips', uses:['Blood glucose monitoring in diabetes'], dosage:'N/A — place strip in glucometer and apply blood sample.', sideEffects:['None when used as directed'], storage:'Store below 30°C. Keep dry. Do not use after expiry.', prescriptionRequired:false, iconName:'thermometer', iconColor:'#F44336' },
  { slug:'m020', name:'Ibuprofen 400mg', genericName:'Ibuprofen', brand:'Brufen', strength:'400mg', packSize:'Strip of 10 Tablets', category:'tablets', mrp:38, wholesalePrice:26, discount:32, stock:2800, manufacturer:'Abbott', gstRate:12, description:'Ibuprofen is an NSAID used for pain relief, fever, and inflammation.', composition:'Ibuprofen IP 400mg', uses:['Mild to moderate pain','Fever','Arthritis','Dysmenorrhoea'], dosage:'1 tablet every 6–8 hours with food. Max 3 tablets/day.', sideEffects:['GI irritation','Peptic ulcer','Renal impairment','Headache'], storage:'Store below 30°C. Keep away from moisture.', prescriptionRequired:false, iconName:'pill', iconColor:'#FF5722' },
  { slug:'m021', name:'Salbutamol Inhaler 100mcg', genericName:'Salbutamol Sulfate', brand:'Ventorlin', strength:'100 mcg/puff', packSize:'Inhaler 200 puffs', category:'injections', mrp:165, wholesalePrice:115, discount:30, stock:650, manufacturer:'GSK', gstRate:12, description:'Short-acting beta2 agonist for relief of acute bronchospasm in asthma and COPD.', composition:'Salbutamol Sulfate 120 mcg equiv. to Salbutamol 100 mcg per puff', uses:['Asthma','COPD','Exercise-induced bronchospasm'], dosage:'1–2 puffs as needed. Max 8 puffs/day.', sideEffects:['Tremor','Palpitations','Tachycardia','Hypokalaemia'], storage:'Store below 30°C. Protect from frost and direct sunlight.', prescriptionRequired:true, iconName:'needle', iconColor:'#2196F3' },
  { slug:'m022', name:'Povidone-Iodine Ointment 5%', genericName:'Povidone-Iodine', brand:'Betadine', strength:'5%', packSize:'Tube of 15g', category:'cream', mrp:58, wholesalePrice:40, discount:31, stock:1800, manufacturer:'Win-Medicare', gstRate:12, description:'Betadine ointment is a broad-spectrum antiseptic for wound care.', composition:'Povidone-Iodine 5% w/w', uses:['Minor wounds','Cuts','Abrasions','Burn first aid'], dosage:'Apply to affected area 1–3 times daily. Cover with dressing.', sideEffects:['Local irritation','Iodine hypersensitivity'], storage:'Store below 30°C. Keep away from light.', prescriptionRequired:false, iconName:'lotion-plus', iconColor:'#FF8F00' },
  { slug:'m023', name:'Nifedipine 10mg', genericName:'Nifedipine', brand:'Depin-10', strength:'10mg', packSize:'Strip of 10 Capsules', category:'capsules', mrp:46, wholesalePrice:32, discount:30, stock:900, manufacturer:'INTAS', gstRate:12, description:'Nifedipine is a dihydropyridine calcium channel blocker for hypertension and angina.', composition:'Nifedipine IP 10mg', uses:['Hypertension','Variant angina','Raynaud\'s phenomenon'], dosage:'1 capsule 3 times a day. Swallow whole; do not chew.', sideEffects:['Headache','Flushing','Ankle oedema','Reflex tachycardia'], storage:'Store below 25°C. Protect from light.', prescriptionRequired:true, iconName:'pill-multiple', iconColor:'#F44336' },
  { slug:'m024', name:'Gripe Water Syrup', genericName:'Dill Oil + Sodium Bicarbonate', brand:'Woodward\'s', strength:'Standard', packSize:'Bottle of 200mL', category:'baby', mrp:112, wholesalePrice:78, discount:30, stock:1500, manufacturer:'GSK', gstRate:12, description:'Gripe water for relief of infant colic, flatulence and teething discomfort.', composition:'Dill Oil 0.005mL + Sodium Bicarbonate 125mg per 5mL', uses:['Infantile colic','Flatulence','Hiccough'], dosage:'5mL up to 6 times daily for infants 1–6 months; 10mL for 6–12 months.', sideEffects:['Sodium load in neonates if overused'], storage:'Store below 25°C. Discard 1 month after opening.', prescriptionRequired:false, iconName:'baby-face', iconColor:'#E91E63' },
  { slug:'m025', name:'ORS Sachets Electrolyte', genericName:'Oral Rehydration Salts', brand:'Electral', strength:'Standard WHO formula', packSize:'Box of 21 Sachets', category:'otc', mrp:92, wholesalePrice:63, discount:32, stock:2400, manufacturer:'FDC Ltd', gstRate:5, description:'WHO standard ORS powder for prevention and treatment of dehydration.', composition:'Sodium Chloride 3.5g + Potassium Chloride 1.5g + Trisodium Citrate 2.9g + Glucose 20g per litre', uses:['Diarrhoea-induced dehydration','Vomiting','Heat stroke','Sports rehydration'], dosage:'Dissolve 1 sachet in 200mL water. Sip frequently.', sideEffects:['Hypernatraemia if given in excess without monitoring'], storage:'Store sachets below 30°C in a dry place.', prescriptionRequired:false, iconName:'water', iconColor:'#2196F3' },
];

const client = await pool.connect();

try {
  console.log('Seeding categories...');
  const catIdBySlug = {};

  for (const cat of CATEGORIES) {
    const r = await client.query(
      `INSERT INTO categories (name, icon) VALUES ($1, $2)
       ON CONFLICT DO NOTHING
       RETURNING id, name`,
      [cat.label, cat.icon]
    );
    if (r.rows.length > 0) {
      catIdBySlug[cat.slug] = r.rows[0].id;
      console.log(`  ✓ Category: ${cat.label} (id=${r.rows[0].id})`);
    } else {
      // Already exists — look it up
      const existing = await client.query('SELECT id FROM categories WHERE name=$1', [cat.label]);
      catIdBySlug[cat.slug] = existing.rows[0].id;
      console.log(`  → Category already exists: ${cat.label}`);
    }
  }

  console.log('\nSeeding medicines...');
  let inserted = 0, skipped = 0;

  for (const m of MEDICINES) {
    const catId = catIdBySlug[m.category] ?? null;
    try {
      await client.query(
        `INSERT INTO medicines
          (name, generic_name, brand, strength, pack_size, manufacturer, description,
           composition, uses, dosage, side_effects, storage, mrp, wholesale_price,
           discount, gst_rate, stock, prescription_required,
           category_id, icon_name, icon_color)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
         ON CONFLICT DO NOTHING`,
        [
          m.name, m.genericName, m.brand, m.strength, m.packSize, m.manufacturer,
          m.description, m.composition,
          JSON.stringify(m.uses), m.dosage, JSON.stringify(m.sideEffects), m.storage,
          m.mrp, m.wholesalePrice, m.discount, m.gstRate,
          m.stock, m.prescriptionRequired,
          catId, m.iconName, m.iconColor
        ]
      );
      console.log(`  ✓ ${m.name}`);
      inserted++;
    } catch (e) {
      console.error(`  ✗ ${m.name}: ${e.message}`);
      skipped++;
    }
  }

  console.log(`\n✅ Done — ${inserted} medicines inserted, ${skipped} skipped`);
} finally {
  client.release();
  await pool.end();
}
