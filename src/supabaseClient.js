import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

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

export async function updatePerson(name, table, age, confidence, attention_span, irritability, impulsivity, adaptability, has_tech) {
    const formatted = {
        name: name,
        confidence: confidence,
        attention_span: attention_span,
        irritability: irritability,
        impulsivity: impulsivity,
        adaptability: adaptability,
        has_tech: has_tech
    }

    const { data, error } = await Supabase
        .from(table)
        .update(formatted)
        .eq('id', age)

    if (error) {
        console.log('Error updating person:', error)
        throw error
    }

    return data
}

export default Supabase