import os
from openai import OpenAI
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

load_dotenv()
app = FastAPI()

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key=os.getenv("API_KEY")
)

IPAD_KID_PERSONALITY = "You have been exposed to various devices and electronics (such as iPads, phones, televisionn etc.) since you were born. \
    					You have medium confidence, low attention span, social and communication challenges, increased anxiety, \
             			impaired emotional comprehension, high level of multitasking, high impulsivity, a tendency to compare yourself to others, chronic sleep issues, \
                    	can't apply learning from a screen, and emotional instability. You are also heavily dependent on a screen being around for entertainment."
NORMAL_KID_PERSONALITY = "You have had exposure to screens, but you control your usage very well, resulting in no more than 3-4 hours of screen time at most per day.\
    					  	You have grown up prioritizing face-to-face interaction, playing outside, reading, school, and friends. \
               				You have a longer attention span, higher critical thinking skills and handling nuance and ambiguity, lower impulsivity \
                       		higher emotional intelligence, lower social comparison, higher internal validation, and lower emotional reactivity. \
                            In general, you are a patient, kind, and emotionally intelligent person."

# age, debate question, memory of previous arguments (cache), change in traits [confidence, attention span, calmness, belief], 
def screen_time_minutes(age: int):
    if age == 6:
        return 218
    if age == 12:
        return 333
    if age == 18:
        return 519
    if age == 25:
        return 460
    
# ------------------------------- IPAD KID --------------------------------
# role of "ipad kid"
@app.post("/ipad_kid_init")
def simulate(req): # req = a json that contains the age and the debate question
    response = client.chat.completions.create(
		model="LLM360/K2-Think-V2",
		messages = [
			{"role": "system", "content": f"You are a {req.age}-year-old person. {IPAD_KID_PERSONALITY}. You have a daily average screen time of about {screen_time_minutes(req.age)} minutes."},
			{"role": "user", "content": f"What is your opinion the following question: {req.debate_q}"} # we can input the prompt here later based on what the user inputs as the prompt
		],
		extra_body={
			"chat_template_kwargs": {"reasoning_effort": "high"},
		},
	)
    return response.choices[0].message.content


@app.post("/ipad_kid_response")
def simulate(req): # req = a json that contains the age and the debate question
    response = client.chat.completions.create(
		model="LLM360/K2-Think-V2",
		messages = [
			{"role": "system", "content": f"You are a {req.age}-year-old person. {IPAD_KID_PERSONALITY}. You have a daily average screen time of about {screen_time_minutes(req.age)} minutes. You have been debating the following question against another person of the same age: {req.debate_q}. You have had the following arguments so far: {req.arguments}. This is what your stats were before their response: {req.traits}."},
			{"role": "user", "content": f"What is your rebuttal to their response? What are your statistics now? Please return a json with all of this information. Only return the JSON file, no text surrounding your response, ONLY the JSON file."} # we can input the prompt here later based on what the user inputs as the prompt
		],
		extra_body={
			"chat_template_kwargs": {"reasoning_effort": "high"},
		},
	)
    
    return response.choices[0].message.content


# ------------------------------- NORMAL KID --------------------------------
# role of normal kid
@app.post("/normal_kid_init")
def simulate(req):
	response = client.chat.completions.create(
		model="LLM360/K2-Think-V2",
		messages = [
			{"role": "system", "content": f"You are a {req.age}-year-old person. {NORMAL_KID_PERSONALITY}"},
   			{"role": "user", "content": f"What is your opinion on the following question: {req.debate_q}"}
		],
		extra_body={
			"chat_template_kwargs": {"reasoning_effort": "high"},
		},
	)
 
	return response.choices[0].message.content


@app.post("/normal_kid_response")
def simulate(req):
	response = client.chat.completions.create(
		model="LLM360/K2-Think-V2",
		messages = [
			{"role": "system", "content": f"You are a {req.age}-year-old person. {NORMAL_KID_PERSONALITY}. You have been debating the following question against another person of the same age: {req.debate_q}. You have had the following arguments so far: {req.arguments}. This is what your stats were before their response: {req.traits}."},
   			{"role": "user", "content": f"What is your rebuttal to their response? What are your statistics now? Please return a json with all of this information. Only return the JSON file, no text surrounding your response, ONLY the JSON file."}
		],
		extra_body={
			"chat_template_kwargs": {"reasoning_effort": "high"},
		},
	)
 
	return response.choices[0].message.content