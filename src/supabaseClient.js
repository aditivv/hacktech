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
    /* returns random integer between min and max (inclusive) */
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function addPerson(name, table) {
    /* updates the first row of specified table with initial values + name to "initialize" a person */
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
        .eq('id', 6)

    if (error) {
        console.log('Error creating person:', error)
        throw error
    }

    return data
}

export async function updatePerson(table, age, confidence, attention_span, irritability, impulsivity, adaptability) {
    /* updates the row with the specified age in the given table with the provided values */
    // retrieves the value of name from the previous year so that it can be preserved in the update
    const { data: data_name, error: fetchError_name } = await Supabase
        .from(table)
        .select('name')
        .eq('id', age-1)
        .single()  // returns a single object instead of an array
    if (fetchError_name) throw fetchError_name

    const name_prev = data_name.name

    // retrieves the value of age_tech_removed from the previous year so that it can be preserved in the update
    const { data: data_tech_removed, error: fetchError_tech_removed } = await Supabase
        .from(table)
        .select('age_tech_removed')
        .eq('id', age-1)
        .single()  // returns a single object instead of an array
    if (fetchError_tech_removed) throw fetchError_tech_removed

    const age_tech_removed_prev = data_tech_removed.age_tech_removed

    // retrieves the value of has_tech from the previous year so that it can be preserved in the update
    const { data, error: fetchError } = await Supabase
        .from(table)
        .select('has_tech')
        .eq('id', age-1)
        .single()  // returns a single object instead of an array

    if (fetchError) throw fetchError

    const has_tech_prev = data.has_tech

    // retrieves the value of age_tech_intro from the previous year so that it can be preserved in the update
    const { data: data2, error: fetchError2 } = await Supabase
        .from(table)
        .select('age_tech_intro')
        .eq('id', age-1)
        .single()  // returns a single object instead of an array

    const age_tech_intro_prev = data2.age_tech_intro

    // updates all other variables in the table based on the parameters passed in, but preserves has_tech, name, and age_tech_intro from the previous year
    const formatted = {
        name: name_prev,
        confidence: confidence,
        attention_span: attention_span,
        irritability: irritability,
        impulsivity: impulsivity,
        adaptability: adaptability,
        has_tech: has_tech_prev,
        age_tech_intro: age_tech_intro_prev,
        age_tech_removed: age_tech_removed_prev
    }

    if (fetchError2) throw fetchError2

    const { data: update_data, error } = await Supabase
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
    /* simulates introducing technology to a person at specified age */
    const { data, error } = await Supabase
        .from(table)
        .update({ has_tech: true, age_tech_intro: age, age_tech_removed: null })
        .eq('id', age)
    
    if (error) {
        console.log('Error adding tech:', error)
        throw error
    }

    return data
}

export async function removeTech(table, age) {
    /* simulates removing  technology from a person at specified age */
    const { data, error } = await Supabase
        .from(table)
        .update({ has_tech: false, age_tech_removed: age })
        .eq('id', age)
    
    if (error) {
        console.log('Error removing tech:', error)
        throw error
    }
    
    return data
}

export async function getConfidence(table, age) {
    /* retrieves the confidence value of the specified person at the specified age */
    const { data, error } = await Supabase
        .from(table)
        .select('confidence')
        .eq('id', age)

    if (error) {
        console.log('Error fetching confidence:', error)
        throw error
    }

    return data[0].confidence // return type: int
}

export async function getAttentionSpan(table, age) {
    /* retrieves the attention span value of the specified person at the specified age */
    const { data, error } = await Supabase
        .from(table)
        .select('attention_span')
        .eq('id', age)
    
    if (error) {
        console.log('Error fetching attention span:', error)
        throw error
    }
    
    return data[0].attention_span // return type: int
}

export async function getIrritability(table, age) {
    /* retrieves the irritability value of the specified person at the specified age */
    const { data, error } = await Supabase 
        .from(table)
        .select('irritability')
        .eq('id', age)

    if (error) {
        console.log('Error fetching irritability:', error)
        throw error
    }

    return data[0].irritability // return type: int
}

export async function getImpulsivity(table, age) {
    /* retrieves the impulsivity value of the specified person at the specified age */
    const { data, error } = await Supabase
        .from(table)
        .select('impulsivity')
        .eq('id', age)

    if (error) {
        console.log('Error fetching impulsivity:', error)
        throw error
    }

    return data[0].impulsivity // return type: int
}

export async function getAdaptability(table, age) {
    /* retrieves the adaptability value of the specified person at the specified age */
    const { data, error } = await Supabase
        .from(table)
        .select('adaptability')
        .eq('id', age)

    if (error) {
        console.log('Error fetching adaptability:', error)
        throw error
    }
    return data[0].adaptability // return type: int
}

export async function getName(table, age) {
    /* retrieves the name of the specified person at the specified age */
    const { data, error } = await Supabase
        .from(table)
        .select('name')
        .eq('id', age)

    if (error) {
        console.log('Error fetching name:', error)
        throw error
    }
    return data[0].name // return type: string
}

export async function getAgeTechIntro(table, age) {
    /* retrieves the age at which the specified person was introduced to technology */
    const { data, error } = await Supabase
        .from(table)
        .select('age_tech_intro')
        .eq('id', age)

    if (error) {
        console.log('Error fetching age tech intro:', error)
        throw error
    }
    return data[0].age_tech_intro // return type: int
}

export async function getAgeTechRemoved(table, age) {
    /* retrieves the age at which technology was removed from the specified person */
    const { data, error } = await Supabase
        .from(table)
        .select('age_tech_removed')
        .eq('id', age)

    if (error) {
        console.log('Error fetching age tech removed:', error)
        throw error
    }  
    return data[0].age_tech_removed // return type: int
}

export async function getTechStatus(table, age) {
    /* retrieves whether the specified person has technology at the specified age */
    const { data, error } = await Supabase
        .from(table)
        .select('has_tech')
        .eq('id', age)
     
    if (error) {
        console.log('Error fetching tech status:', error)
        throw error
    }
    return data[0].has_tech // return type: boolean
}

export default Supabase