# Screenbound
By Sophie Choi and Aditi Varia

## Inspiration
As people who were born in 2007, we were the last generation to grow up without excessive technology from birth. Now, we see that much of the new generation grew up on their devices and social media, which caused them to avoid socializing with peers and interacting with the real world. Since this phenomenon is fairly recent, it is difficult to tell how these kids will interact in the world in their teen years and early adulthood. Our project simulates what the future looks like for the generation of “iPad kids” and has an interactive experience detailing how a group of friends may deteriorate with one friend’s obsession with their new device.

## What it does
Screenbound is a simulation that displays how relationships between people can grow and deteriorate over time based on their exposure to excessive technology and media at specific developmental stages. Specifically, our web app displays 5 individuals and follows them through the first 24 years of their simulated lifetime. The program allows users to simulate years passing in time, and gives the user the option to introduce technology into any of the individuals’ lives at any point in time. Similarly, the user has the option to remove the excessive exposure to technology at any point in time as well, while still accounting for the fact that the individual was exposed to technology for a certain period of time. 

During each year, the user can view each individual person and some of their key traits, including confidence, attention span, irritability, impulsivity, and adaptability, as well as their relationship/closeness with the other individuals in the simulation. These values will change over time depending on their exposure to technology, simulating the impact of technology on human interactions and relationships. The user additionally has the ability to go back in time and make changes, allowing them to simulate how different events could change the trajectory of these relationships.

Finally, the user can scroll down in the web app to view information about the growing influence of technology on today’s youth, and can learn more about the negative effects of excessive exposure to technology impacts children in the long run. As a whole, our project is intended to simulate what seems to be the inevitable future of the “iPad kids” of today, and serves as a warning for upcoming generations.

## How we built it
We built it using React in the frontend and Python’s FastAPI for the backend. Within the frontend, we used Loveable to create an intuitive frontend that will perfectly display our simulation with a dynamic interface. Within the backend, we used K2 Think V2 to simulate the interactions between the group of friends and have the friend group adapt to a friend’s obsession with a device. We also used a DBMS called Supabase for our database, which stores information about each person in our simulation. 

## What's next for Screenbound
In the future, it would be nice to incorporate dialogue between the friends, so that it is obvious why certain changes in their friendship occurred. It would also be better if the amount of people in the friend group could be dynamically changed in the beginning, so that the simulation can become more complex.
