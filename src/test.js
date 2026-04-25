// test.js
import { addPerson } from './supabaseClient.js'

addPerson('Sophie', 'person_A')
    .then(data => console.log('Success:', data))
    .catch(err => console.error('Error:', err))