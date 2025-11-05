/**
 * Script to populate addresses table from Geonorge API
 * Run with: node scripts/populate-addresses.js
 * 
 * This script fetches street names from major Norwegian cities
 * and populates the Supabase addresses table.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Major Norwegian cities
const cities = [
  'Oslo',
  'Bergen',
  'Trondheim',
  'Stavanger',
  'Kristiansand',
  'Tromsø',
  'Drammen',
  'Fredrikstad',
  'Sandnes',
  'Bodø',
  'Ålesund',
  'Sandefjord',
  'Tønsberg',
  'Moss',
  'Haugesund',
  'Arendal',
  'Porsgrunn',
  'Skien',
  'Hamar',
  'Lillehammer'
];

async function fetchStreetsForCity(city) {
  try {
    console.log(`Fetching streets for ${city}...`);
    
    // Fetch sample addresses from Geonorge
    const response = await fetch(
      `https://ws.geonorge.no/adresser/v1/sok?kommunenavn=${encodeURIComponent(city)}&treffPerSide=1000`
    );
    
    const data = await response.json();
    
    if (!data.adresser) {
      console.log(`No addresses found for ${city}`);
      return [];
    }

    // Extract unique street names
    const streetNames = new Set();
    data.adresser.forEach(addr => {
      if (addr.adressenavn) {
        streetNames.add(addr.adressenavn);
      }
    });

    const addresses = Array.from(streetNames).map(street => ({
      city: city,
      street_name: street
    }));

    console.log(`Found ${addresses.length} unique streets in ${city}`);
    return addresses;
  } catch (error) {
    console.error(`Error fetching streets for ${city}:`, error);
    return [];
  }
}

async function populateAddresses() {
  console.log('Starting address population...\n');

  for (const city of cities) {
    const addresses = await fetchStreetsForCity(city);
    
    if (addresses.length === 0) continue;

    // Insert in batches of 100
    const batchSize = 100;
    for (let i = 0; i < addresses.length; i += batchSize) {
      const batch = addresses.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('addresses')
        .upsert(batch, { 
          onConflict: 'city,street_name',
          ignoreDuplicates: true 
        });

      if (error) {
        console.error(`Error inserting batch for ${city}:`, error);
      } else {
        console.log(`✓ Inserted ${batch.length} streets for ${city}`);
      }
    }

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ Address population complete!');
}

populateAddresses().catch(console.error);
