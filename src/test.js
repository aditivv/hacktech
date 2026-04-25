// test.js
import 'dotenv/config'
import Supabase, { addPerson, addTech, removeTech } from './supabaseClient.js'

removeTech('person_A', 6)
    .then(data => console.log('Removed tech:', data))
    .catch(err => console.error('Error removing tech:', err))