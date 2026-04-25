from openai import OpenAI
from .env import API_KEY
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key=API_KEY
)

# role of "ipad kid"
@app.post("/ipad_kid")
def simulate(req): # req = a json that contains the age and the debate question
    response = client.chat.completions.create(
		model="LLM360/K2-Think-V2",
		messages = [
			{"role": "system", "content": f"You are a {req.age}-year-old person. [additional context]"},
			{"role": "user", "content": f"Debate the following question: {req.debate_q}"} # we can input the prompt here later based on what the user inputs as the prompt
		],
		extra_body={
			"chat_template_kwargs": {"reasoning_effort": "high"},
		},
	)
    return response.choices[0].message.content

# role of normal kid
@app.post("/normal_kid")
def simulate(req):
	response = client.chat.completions.create(
		model="LLM360/K2-Think-V2",
		messages = [
			{"role": "system", "content": f"You are a {req.age}-year-old person. [additional context]"},
   			{"role": "user", "content": f"Debate the following question: {req.debate_q}"}
		],
		extra_body={
			"chat_template_kwargs": {"reasoning_effort": "high"},
		},
	)
 
	return response.choices[0].message.content