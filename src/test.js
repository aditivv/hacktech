// test.js
import 'dotenv/config'
import Supabase, { addPerson, addTech, removeTech, updatePerson, getName } from './supabaseClient.js'

// addPerson('Sophie', 'person_A')
//     .then(data => console.log('Added person:', data))
//     .catch(err => console.error('Error adding person:', err))

getName('person_A', 1)
    .then(data => console.log('Name at age 1:', data))
    .catch(err => console.error('Error fetching name:', err))

// updatePerson('person_A', 2, 85, 75, 65, 55, 35)
//     .then(data => console.log('Updated person:', data))
//     .catch(err => console.error('Error updating person:', err))


// addTech('person_A', 2)
//     .then(data => console.log('Added tech:', data))
//     .catch(err => console.error('Error adding tech:', err))


// updatePerson('person_A', 3, 90, 80, 70, 60, 40)
//     .then(data => console.log('Updated person:', data))
//     .catch(err => console.error('Error updating person:', err))


// updatePerson('person_A', 4, 85, 75, 65, 55, 35)
//     .then(data => console.log('Updated person:', data))
//     .catch(err => console.error('Error updating person:', err))


// removeTech('person_A', 4)
//     .then(data => console.log('Removed tech:', data))
//     .catch(err => console.error('Error removing tech:', err))


// updatePerson('person_A', 5, 80, 70, 60, 50, 30)
//     .then(data => console.log('Updated person:', data))
//     .catch(err => console.error('Error updating person:', err))
