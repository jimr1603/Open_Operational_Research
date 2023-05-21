import mesa
from random_walk import RandomWalker
import numpy as np

class PigAgent(RandomWalker):
    """An agent with fixed initial wealth."""

    adult = False
    love_points = 0
    countdown = 50

    def __init__(self, unique_id, pos, model, moore=True, adult=False):
        super().__init__(unique_id, pos, model, moore=moore)
        self.adult = adult
        
    def step(self):
        # The agent's step will go here.
        # For demonstration purposes we will print the agent's unique_id

        self.random_move()
       # If child, get a bit older
        if (not self.adult):
            self.countdown -= 1
            if self.countdown == 0:
                self.adult = True

        elif (self.love_points <= 3): #is an adult, can it become pregnant?
            partners = self.model.grid.get_neighbors(self.pos, moore=False, radius = 3, include_center=True)
            if (len(partners) >=2): #Some form of partner in range
                crowd = self.model.grid.get_neighbors(self.pos, moore=False, radius = 5, include_center=True)
                if (len(crowd) <= 5): #Including self, not overcrowded
                    rng = np.random.default_rng()
                    if(rng.random() < 0.33): #Successful roll
                        self.love_points += 1
                        if self.love_points == 3:
                            self.countdown = 6
        else: #pregnant
            self.countdown -= 1
            
            if self.countdown == 0:
                # spawn a piglet
                piglet = PigAgent(self.model.next_id(), self.pos, self.model, False)
                self.model.grid.place_agent(piglet, self.pos)
                self.model.schedule.add(piglet)
                self.love_points = 0



class PigPenModel(mesa.Model):
    """A model with some number of agents."""

    def __init__(self, N, width):
        height = width #lazy way to make the pens square
        super().__init__()
        self.num_agents = N
        self.grid = mesa.space.MultiGrid(width, height, torus=False)
        self.schedule = mesa.time.RandomActivation(self)
        
        self.datacollector =  mesa.DataCollector(model_reporters= {"n":self.schedule.get_agent_count} , agent_reporters=None)

        # Create agents
        for i in range(self.num_agents):

            pig = PigAgent(self.next_id(), (0,0), self, False, adult=True)
            self.grid.place_agent(pig, (0,0))
            self.schedule.add(pig)


    def step(self):
        """Advance the model by one step."""
        
        self.datacollector.collect(self)
        self.schedule.step()
