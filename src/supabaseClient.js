import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_API_KEY

const Supabase = createClient(supabaseUrl, supabaseKey)

// initialize a person at age 6 with random traits and no tech; can enter which person through the table parameter

/* age 6 traits range:
- confidence: 55-80
- attention span: 20-45
- irritability: 40-65
- impulsivity: 60-85
- adaptability: 30-55
*/

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function addPerson(name, table) {
    const formatted = {
        name: name,
        confidence: randInt(55, 80),
        attention_span: randInt(20, 45),
        irritability: randInt(40, 65),
        impulsivity: randInt(60, 85),
        adaptability: randInt(30, 55),
    }

    const { data, error } = await Supabase
        .from(table)
        .update(formatted)
        .eq('id', 1)

    if (error) {
        console.log('Error creating person:', error)
        throw error
    }

    return data
}

export async function updatePerson(name, table, age, confidence, attention_span, irritability, impulsivity, adaptability) {
    // retrieves the value of has_tech from the previous year so that it can be preserved in the update
    const { data, error: fetchError } = await Supabase
        .from(table)
        .select('has_tech')
        .eq('id', age-1)
        .single()  // returns a single object instead of an array

    if (fetchError) throw fetchError

    const has_tech_prev = data.has_tech

    // retrieves the value of age_tech_intro from the previous year so that it can be preserved in the update
    const { data2, error: fetchError2 } = await Supabase
        .from(table)
        .select('age_tech_intro')
        .eq('id', age-1)
        .single()  // returns a single object instead of an array

    const age_tech_intro_prev = data2.age_tech_intro

    // updates all other variables in the table based on the parameters passed in, but preserves has_tech and age_tech_intro from the previous year
    const formatted = {
        name: name,
        confidence: confidence,
        attention_span: attention_span,
        irritability: irritability,
        impulsivity: impulsivity,
        adaptability: adaptability,
        has_tech: has_tech_prev,
        age_tech_intro: age_tech_intro_prev
    }

    if (fetchError2) throw fetchError2

    const { update_data, error } = await Supabase
        .from(table)
        .update(formatted)
        .eq('id', age)

    if (error) {
        console.log('Error updating person:', error)
        throw error
    }

    return update_data
}

export async function addTech(table, age) {
    const { data, error } = await Supabase
        .from(table)
        .update({ has_tech: true, age_tech_intro: age })
        .eq('id', age)
    
    if (error) {
        console.log('Error adding tech:', error)
        throw error
    }

    return data
}

export async function removeTech(table, age) {
    const { data, error } = await Supabase
        .from(table)
        .update({ has_tech: false, age_tech_intro: null })
        .eq('id', age)
    
    if (error) {
        console.log('Error removing tech:', error)
        throw error
    }
    
    return data
}

export default Supabase