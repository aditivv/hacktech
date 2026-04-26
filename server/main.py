import os
from openai import OpenAI
from dotenv import load_dotenv
from fastapi import FastAPI, Body
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()

class IpadKidRequest(BaseModel):
    age: int
    age_tech_intro: int
    stats: dict
    
class NormalKidRequest(BaseModel):
    age: int
    stats: dict

class RelationshipRequest(BaseModel):
    petr1: str
    petr2: dict
    petr3: dict
    petr4: dict
    petr5: dict

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    base_url="https://cerebras.ai",
    api_key=os.getenv("API_KEY")
)
    
# ------------------------------- IPAD KID --------------------------------
# have AI change values of the ipad kids traits.
@app.post("/age_ipad_kid")
def simulate(req: IpadKidRequest = Body(...)): # req = a json that contains the age and the debate question
    response = client.chat.completions.create(
			model="LLM360/K2-Think-V2",
			messages = [
				{
					"role": "system", 
					"content": 
							f"You are a kid who received exposure to social media and technology at age {str(req.age_tech_intro)}\
							You have a friend group of 5 friends including yourself that you have had since you\
							were 6 years old. However, because of the amount of media you consume (about 6-8 hours of recreational media),\
							You become more distant from your friends. Your confidence, attention span, irritability, impulsivity, and adaptability\
							keep decreasing every year due to your newfound fixation on technology, causing you to worsen your relationship \
							with people in your friend group."
				},
				{
						"role": "user", 
						"content": 
							f"These are your old stats: {req.stats}. You are now {str(req.age)} years old. \
							Now rank yourself in these stats from 0-100 based on how you personally feel now that you have been \
							on social media and technology since age {str(req.age_tech_intro)}. Return it as only a json object and nothing else. \
							Remember that your most formative years are 6, 12, 18, 24."
				}
			],
			extra_body={
				"chat_template_kwargs": {"reasoning_effort": "high"},
			},
		)
    
    return response


# ------------------------------- NORMAL KID --------------------------------
# role of normal kid
@app.post("/normal_kid_init")
def simulate(req: NormalKidRequest = Body(...)):
	response = client.chat.completions.create(
		model="LLM360/K2-Think-V2",
		messages = [
			{
     		"role": "system", 
    		"content": 
        		f"You are a kid who is moderately exposed to technology. You enjoy playing outside, reading, hanging\
            out with friends and family, and being studious. You have been in a friend group of 5 friends \
            since you were 6 years old. You are confident, have a good attention span, patient, "
      },
			{
     			"role": "user", 
        	"content": 
           	f"These are your old stats: {req.stats}. You are now {req.age} years old. \
            Now rank yourself in these stats from 0-100 based on how you personally feel. \
            Return it as only a json object and nothing else. \
            Remember that your most formative years are 6, 12, 18, 24."
      }
		],
		extra_body={
			"chat_template_kwargs": {"reasoning_effort": "high"},
		},
	)
 
	return response.choices[0].message.content


#------------------COMPATABILITY-----------------------
@app.post("/relationship")
def simulate(req: RelationshipRequest = Body(...)): # req = a json that contains the age and the debate question
    response = client.chat.completions.create(
			model="LLM360/K2-Think-V2",
			messages = [
				{
					"role": "system", 
					"content": 
							f"Imagine you are {req.petr1}. You are gauging your relationship with 4 of your friends who \
         			have the following stats in the form of JSON objects: {req.petr2} {req.petr3} {req.petr4} {req.petr5}"
				},
				{
						"role": "user", 
						"content": 
							f"Return a JSON object with the key being the friend's name and the value being your relationship with \
         				them on a scale of 0-100 based on your friends' traits. Only the JSON object and no one else"
				}
			],
			extra_body={
				"chat_template_kwargs": {"reasoning_effort": "high"},
			},
		)
    
    return response.choices[0].message.content