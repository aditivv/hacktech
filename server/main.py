import os
from openai import OpenAI
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key=os.getenv("API_KEY")
)

IPAD_KID_PERSONALITY = ""
NORMAL_KID_PERSONALITY = ""
    
# ------------------------------- IPAD KID --------------------------------
# have AI change values of the ipad kids traits.
@app.post("/age_ipad_kid")
def simulate(req): # req = a json that contains the age and the debate question
    response = client.chat.completions.create(
		model="LLM360/K2-Think-V2",
		messages = [
			{
     		"role": "system", 
    		"content": 
        		f"You are a kid who received exposure to social media and technology at age {req.age_tech_intro}\
     				You have a friend group of 5 friends including yourself that you have had since you\
            were 6 years old. However, because of the amount of media you consume (about 6-8 hours of recreational media),\
            You become more distant from your friends. Your confidence, attention span, irritability, impulsivity, and adaptability\
            keep decreasing every year due to your newfound fixation on technology, causing you to worsen your relationship \
            with people in your friend group."
      },
			{
     			"role": "user", 
        	"content": 
           	f"These are your old stats: {req.stats}. You are now {req.age} years old. \
            Now rank yourself in these stats from 0-100 based on how you personally feel now that you have been \
            on social media and technology since age {req.age_tech_intro}. Return it as only a json object and nothing else. \
            Remember that your most formative years are 6, 12, 18, 24."
      }
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
			{"role": "system", "content": ""},
			{"role": "user", "content": ""}
		],
		extra_body={
			"chat_template_kwargs": {"reasoning_effort": "high"},
		},
	)
	return response.choices[0].message.content