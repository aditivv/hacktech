import os
import json
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
    base_url="https://api.k2think.ai/v1",
    api_key=os.getenv("CEREBRAS_API_KEY")
)
    
# ------------------------------- IPAD KID --------------------------------
# have AI change values of the ipad kids traits.
@app.post("/age_ipad_kid")
def simulate(req: IpadKidRequest = Body(...)): # req = a json that contains the age and the debate question
    response = client.chat.completions.create(
			model="MBZUAI-IFM/K2-Think-v2",
			messages = [
				{
					"role": "system",
					"content": 
						f"You are {str(req.age)} years old. Since age {str(req.age_tech_intro)}, you have had unrestricted access \
						to social media and technology, consuming 6-8 hours of recreational media daily. \
						This has gradually distanced you from your friend group of 5 people. \
						Each year, your traits shift as follows due to your technology use: \
						confidence DECREASES, attention_span DECREASES, adaptability DECREASES, \
						irritability INCREASES, impulsivity INCREASES. \
						Focus on making the changes in these values REALISTIC over making them dramatic - we want this to simulate humanity, and how technology can subtly but significantly impact development over time. \
						Key ages where introduction to technology causes the most detrimental effects in the long-run: 6, 12, 18, 24."
				},
				{
					"role": "user",
					"content":
						f"Your current traits (scale 1-100) are: {req.stats}. \
						You are now {str(req.age)} years old, having used technology since age {str(req.age_tech_intro)}. \
						Update each trait value to reflect your current state. \
						Return ONLY a JSON object, no other text."
				}
			],
			extra_body={
				"chat_template_kwargs": {"reasoning_effort": "high"},
			},
		)
    res = response.choices[0].message.content
    think_index = res.rfind('</think>')
    parsed = json.loads(res[think_index + 8:].strip())
    print(parsed)
    return parsed


# ------------------------------- NORMAL KID --------------------------------
# role of normal kid
@app.post("/age_normal_kid")
def simulate(req: NormalKidRequest = Body(...)):
	response = client.chat.completions.create(
		model="MBZUAI-IFM/K2-Think-v2",
		messages = [
			{
				"role": "system",
				"content":
					f"You are {req.age} years old and have had a normal, healthy upbringing with moderate technology use. \
					You enjoy outdoor activities, reading, socializing, and academics. \
					You have maintained the same friend group of 5 people since age 6. \
					Your traits change only slightly each year due to natural aging — \
					there are no dramatic shifts in any direction. \
					Focus on making the changes in these values REALISTIC over making them dramatic - we want this to simulate humanity, and how development naturally progresses without significant exposure to technology. \
					Key ages where natural development causes the most change in the long-run: 6, 12, 18, 24."
			},
			{
				"role": "user",
				"content":
					f"Your current traits (scale 1-100) are: {req.stats}. "
					f"You are now {req.age} years old. "
					f"Update each trait to reflect subtle, natural changes from aging only — no dramatic shifts. "
					f"Return ONLY a JSON object in this exact format, no other text: "
					f'{{"confidence": 0, "attention_span": 0, "irritability": 0, "impulsivity": 0, "adaptability": 0}}'
			}
		],
		extra_body={
			"chat_template_kwargs": {"reasoning_effort": "high"},
		},
	)

	res = response.choices[0].message.content
	think_index = res.rfind('</think>')
	parsed = json.loads(res[think_index + 8:].strip())
	print(parsed)
	return parsed


#------------------COMPATABILITY-----------------------
@app.post("/relationship")
def simulate(req: RelationshipRequest = Body(...)): # req = a json that contains the age and the debate question
    response = client.chat.completions.create(
			model="MBZUAI-IFM/K2-Think-v2",
			messages = [
				{
					"role": "system",
					"content":
						f"You are a person with the following traits: {req.petr1}. "
						f"You have 4 friends, each described by their trait profiles below. "
						f"Relationship strength is determined by trait compatibility — "
						f"similar confidence, adaptability, and attention span levels bring people closer, "
						f"while large differences in irritability and impulsivity create friction. "
						f"Friend profiles: "
						f"Friend 1: {req.petr2} "
						f"Friend 2: {req.petr3} "
						f"Friend 3: {req.petr4} "
						f"Friend 4: {req.petr5}"
				},
				{
					"role": "user",
					"content":
						f"Rate your relationship with each friend on a scale of 0-100, "
						f"where 0 is completely estranged and 100 is an extremely close bond. "
						f"Base your rating purely on trait compatibility between yourself and each friend. "
						f"Return ONLY a JSON object in this exact format, no other text: "
						f'{{"friend_1": 0, "friend_2": 0, "friend_3": 0, "friend_4": 0}}'
				}
			],
			extra_body={
				"chat_template_kwargs": {"reasoning_effort": "high"},
			},
		)
    
    res = response.choices[0].message.content
    think_index = res.rfind('</think>')
    parsed = json.loads(res[think_index + 8:].strip())
    print(parsed)
    return parsed